#!/usr/bin/env python3
"""Build the /portfolio.html photo set from the shared Google Drive folder.

The originals are 10-34 MB camera JPEGs, far too heavy to serve. This script
pulls each one, writes a small set of web-sized derivatives into
public/portfolio/, and regenerates src/portfolioPhotos.ts so the page picks up
the real dimensions of every photo.

Usage
-----
    python3 scripts/import_portfolio_photos.py
    python3 scripts/import_portfolio_photos.py --from-dir ~/Downloads/miso
    python3 scripts/import_portfolio_photos.py --keep-originals

--from-dir skips Drive entirely and reads the originals off disk, matching them
to the worklist by filename. Use it when the network cannot reach Drive, or when
someone has already downloaded the folder as a zip.

Two things worth knowing about the conversion:

* Orientation is baked in before EXIF is dropped. Camera JPEGs lean on an EXIF
  orientation flag, so stripping the metadata first would publish a chunk of the
  set rotated on its side.
* EXIF is then dropped entirely, which matters beyond file size: these are shot
  on location, and camera GPS tags would otherwise ship the exact coordinates of
  every client's restaurant to anyone who downloads a photo.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

try:
    from PIL import Image, ImageOps
except ImportError:  # pragma: no cover
    sys.exit("Pillow is required: pip install Pillow")

ROOT = Path(__file__).resolve().parent.parent
WORKLIST = ROOT / "scripts" / "portfolio-photos.json"
OUT_DIR = ROOT / "public" / "portfolio"
MANIFEST = ROOT / "src" / "portfolioPhotos.ts"
ORIGINALS = ROOT / ".portfolio-originals"

# Widths the grid picks between, and the one the lightbox loads.
GRID_WIDTHS = (640, 1024)
FULL_WIDTH = 1600
# Browsers without WebP get a single JPEG at this width.
FALLBACK_WIDTH = 1024

WEBP_QUALITY = 78
JPEG_QUALITY = 82

USER_AGENT = "Mozilla/5.0 (compatible; miso-portfolio-import/1.0)"
DOWNLOAD_HOSTS = (
    "https://drive.usercontent.google.com/download",
    "https://drive.google.com/uc",
)


# ───────────────────────── download ─────────────────────────


def _request(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=180) as resp:
        return resp.read()


def _looks_like_jpeg(blob: bytes) -> bool:
    return blob[:3] == b"\xff\xd8\xff"


def _file_is_jpeg(path: Path) -> bool:
    """Peek at the magic bytes without pulling a 30 MB original into memory."""
    try:
        with path.open("rb") as fh:
            return _looks_like_jpeg(fh.read(3))
    except OSError:
        return False


def download(drive_id: str, dest: Path, attempts: int = 4) -> None:
    """Fetch a public Drive file, working around the virus-scan interstitial.

    Files over ~25 MB serve an HTML confirmation page instead of the bytes.
    Passing confirm=t to the usercontent host skips it; if Google still returns
    HTML we dig the real link out of the page and follow it.
    """
    last_error: str | None = None

    for attempt in range(1, attempts + 1):
        for host in DOWNLOAD_HOSTS:
            params = urllib.parse.urlencode(
                {"id": drive_id, "export": "download", "confirm": "t"}
            )
            try:
                blob = _request(f"{host}?{params}")
            except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError) as exc:
                last_error = f"{type(exc).__name__}: {exc}"
                continue

            if _looks_like_jpeg(blob):
                dest.write_bytes(blob)
                return

            # An interstitial came back. The real target sits in a form action
            # plus hidden inputs, so rebuild the URL and try once more.
            follow = _interstitial_url(blob)
            if follow:
                try:
                    blob = _request(follow)
                except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError) as exc:
                    last_error = f"{type(exc).__name__}: {exc}"
                    continue
                if _looks_like_jpeg(blob):
                    dest.write_bytes(blob)
                    return

            last_error = "server returned HTML, not an image"

        if attempt < attempts:
            backoff = 2**attempt
            print(f"      retry in {backoff}s ({last_error})")
            time.sleep(backoff)

    raise RuntimeError(f"could not download {drive_id}: {last_error}")


def _interstitial_url(blob: bytes) -> str | None:
    page = blob.decode("utf-8", "ignore")
    action = re.search(r'action="([^"]+)"', page)
    if not action:
        return None
    base = action.group(1).replace("&amp;", "&")
    fields = dict(
        re.findall(r'name="([^"]+)"\s+value="([^"]*)"', page)
    )
    if not fields:
        return base
    joiner = "&" if "?" in base else "?"
    return f"{base}{joiner}{urllib.parse.urlencode(fields)}"


# ───────────────────────── conversion ─────────────────────────


IMAGE_SUFFIXES = {".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff"}


def collect_from_dir(folder: Path) -> list[dict]:
    """Take every image in a folder, in filename order.

    This is the path to use when the photos did not come from the Drive folder
    in portfolio-photos.json. Alt text comes from an optional alt.json sitting
    beside them, mapping filename to its description:

        { "1.jpg": "Garlic bread with herb oil", "2.jpg": "..." }
    """
    alt_map: dict[str, str] = {}
    alt_file = folder / "alt.json"
    if alt_file.exists():
        alt_map = json.loads(alt_file.read_text(encoding="utf-8"))

    photos = []
    for path in sorted(folder.iterdir(), key=lambda p: p.name.lower()):
        if path.suffix.lower() not in IMAGE_SUFFIXES:
            continue
        entry = {"file": path.name, "path": path}
        if path.name in alt_map:
            entry["alt"] = alt_map[path.name]
        photos.append(entry)
    return photos


def slugify(filename: str) -> str:
    stem = Path(filename).stem
    # Lightroom/Topaz export suffixes carry no meaning on the web.
    stem = re.sub(r"-Enhanced(-NR)?$", "", stem, flags=re.IGNORECASE)
    stem = re.sub(r"[^A-Za-z0-9]+", "-", stem).strip("-").lower()
    if not stem:
        return "photo"
    # A bare number makes an opaque filename on disk and an awkward URL.
    if stem.isdigit():
        stem = f"photo-{stem}"
    return stem


def derivatives(src: Path, slug: str) -> dict:
    """Write the web-sized copies of one photo and report its real geometry."""
    with Image.open(src) as raw:
        # Bake the EXIF orientation flag into the pixels, then convert to RGB so
        # the metadata (GPS included) is gone from every copy we write.
        img = ImageOps.exif_transpose(raw)
        if img.mode not in ("RGB", "L"):
            img = img.convert("RGB")

        source_w, source_h = img.size
        aspect = source_w / source_h

        wanted = sorted({*GRID_WIDTHS, FULL_WIDTH, FALLBACK_WIDTH})
        # Never upscale: a narrow source caps every derivative at its own width.
        widths = [w for w in wanted if w <= source_w] or [source_w]
        # A source that sits between two standard widths (say 1333) would
        # otherwise be served at the next one down, throwing away detail the
        # lightbox could have shown. Keep its own width as the largest size.
        if source_w < FULL_WIDTH and source_w not in widths:
            widths.append(source_w)
            widths.sort()

        # The JPEG fallback rides along with whichever width sits closest to
        # FALLBACK_WIDTH, which may be the source width on a narrow photo.
        fallback_width = min(widths, key=lambda w: abs(w - FALLBACK_WIDTH))

        written: dict[int, tuple[int, int]] = {}
        for width in widths:
            height = max(1, round(width / aspect))
            resized = img.resize((width, height), Image.LANCZOS)
            resized.save(
                OUT_DIR / f"{slug}-{width}.webp",
                "WEBP",
                quality=WEBP_QUALITY,
                method=6,
            )
            if width == fallback_width:
                resized.save(
                    OUT_DIR / f"{slug}-{width}.jpg",
                    "JPEG",
                    quality=JPEG_QUALITY,
                    optimize=True,
                    progressive=True,
                )
            written[width] = (width, height)

    grid = [w for w in (*GRID_WIDTHS, FULL_WIDTH) if w in written]
    full = max(written)
    return {
        "widths": grid or [full],
        "fallbackWidth": fallback_width,
        "fullWidth": full,
        "width": written[full][0],
        "height": written[full][1],
    }


# ───────────────────────── manifest ─────────────────────────


def write_manifest(entries: list[dict]) -> None:
    rows = []
    for e in entries:
        slug = e["slug"]
        srcset = ", ".join(f"/portfolio/{slug}-{w}.webp {w}w" for w in e["widths"])
        fallback = "/portfolio/{}-{}.jpg".format(slug, e["fallbackWidth"])
        full = "/portfolio/{}-{}.webp".format(slug, e["fullWidth"])
        rows.append(
            "  {\n"
            f"    slug: {json.dumps(slug)},\n"
            f"    alt: {json.dumps(e['alt'])},\n"
            f"    width: {e['width']},\n"
            f"    height: {e['height']},\n"
            f"    srcSet: {json.dumps(srcset)},\n"
            f"    fallback: {json.dumps(fallback)},\n"
            f"    full: {json.dumps(full)},\n"
            "  },"
        )

    MANIFEST.write_text(
        "// GENERATED FILE — do not edit by hand.\n"
        "// Rebuild with: npm run import-portfolio\n"
        "// Source: scripts/portfolio-photos.json\n"
        "\n"
        "export type PortfolioPhoto = {\n"
        "  slug: string;\n"
        "  /** Describes the photo for screen readers. Edit alt text in\n"
        "   *  scripts/portfolio-photos.json, not here — this file is regenerated. */\n"
        "  alt: string;\n"
        "  /** Intrinsic size of the largest derivative, used to reserve layout space. */\n"
        "  width: number;\n"
        "  height: number;\n"
        "  /** Responsive WebP candidates for the grid. */\n"
        "  srcSet: string;\n"
        "  /** Single JPEG for browsers without WebP. */\n"
        "  fallback: string;\n"
        "  /** Larger copy the lightbox loads on demand. */\n"
        "  full: string;\n"
        "};\n"
        "\n"
        "export const portfolioPhotos: PortfolioPhoto[] = [\n"
        + "\n".join(rows)
        + "\n];\n",
        encoding="utf-8",
    )


# ───────────────────────── entry point ─────────────────────────


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--from-dir",
        type=Path,
        help="read originals from this directory instead of downloading them",
    )
    parser.add_argument(
        "--keep-originals",
        action="store_true",
        help=f"leave downloaded originals in {ORIGINALS.name}/ instead of deleting them",
    )
    args = parser.parse_args()

    worklist = json.loads(WORKLIST.read_text(encoding="utf-8"))
    default_alt = worklist.get("defaultAlt", "Photography by Miso Marketing Group")

    if args.from_dir:
        # Ingest the folder as-is. The Drive worklist does not apply: these
        # photos need not have come from that folder, or match its filenames.
        source_dir = args.from_dir.expanduser()
        if not source_dir.is_dir():
            sys.exit(f"not a directory: {source_dir}")
        photos = collect_from_dir(source_dir)
        if not photos:
            sys.exit(f"no images found in {source_dir}")
        print(f"Importing {len(photos)} image(s) from {source_dir}\n")
    else:
        photos = worklist["photos"]

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    ORIGINALS.mkdir(parents=True, exist_ok=True)

    entries: list[dict] = []
    failures: list[str] = []
    used_slugs: set[str] = set()

    for i, photo in enumerate(photos, 1):
        name = photo["file"]
        slug = slugify(name)
        # Two sources can reduce to the same slug (photo.jpg and photo.png),
        # and the second would silently overwrite the first's derivatives.
        if slug in used_slugs:
            n = 2
            while f"{slug}-{n}" in used_slugs:
                n += 1
            slug = f"{slug}-{n}"
        used_slugs.add(slug)
        print(f"[{i:2}/{len(photos)}] {name} -> {slug}")

        if args.from_dir:
            src = photo["path"]
        else:
            src = ORIGINALS / name
            if _file_is_jpeg(src):
                print("      already downloaded")
            else:
                try:
                    download(photo["driveId"], src)
                except RuntimeError as exc:
                    print(f"      FAILED {exc}")
                    failures.append(name)
                    continue

        geom = derivatives(src, slug)
        entries.append({"slug": slug, "alt": photo.get("alt", default_alt), **geom})
        print(f"      {geom['width']}x{geom['height']} -> {len(geom['widths'])} webp + jpg")

        if not args.from_dir and not args.keep_originals:
            src.unlink(missing_ok=True)

    if entries:
        write_manifest(entries)
        print(f"\nWrote {MANIFEST.relative_to(ROOT)} with {len(entries)} photos.")
        print(f"Derivatives in {OUT_DIR.relative_to(ROOT)}.")
    else:
        print("\nNothing imported; manifest left untouched.")

    if failures:
        print(f"\n{len(failures)} photo(s) could not be imported:")
        for name in failures:
            print(f"  - {name}")
        print(
            "\nIf these failed on the network, the environment's policy is blocking\n"
            "drive.google.com. Either allow that host or download the folder and\n"
            "re-run with --from-dir."
        )
        return 1

    where = "an alt.json beside the images" if args.from_dir else "scripts/portfolio-photos.json"
    print(
        f"\nNext: give each photo real alt text in {where} and re-run, so\n"
        "screen readers get more than the generic fallback."
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
