# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

## Portfolio page

`/portfolio.html` is a second Vite entry point (see `build.rollupOptions.input`
in `vite.config.ts`), not a client-side route — so it builds to a real static
file that survives a refresh or a direct visit, with no SPA rewrite rules
needed on the host. The home page keeps its own gallery section as a teaser and
links through to it.

The photos it shows are generated, not committed by hand:

```bash
python3 -m venv .venv          # first time only
source .venv/bin/activate
pip install Pillow             # first time only

npm run import-portfolio
```

Pillow is a library, so install it into a virtualenv as above. Homebrew and
system Pythons refuse a bare `pip install` (PEP 668) and their error suggests
pipx, but pipx isolates *applications* — a library installed that way will not
be importable by the script.

That reads the worklist in `scripts/portfolio-photos.json`, pulls each original
from the shared Drive folder, writes web-sized WebP/JPEG derivatives into
`public/portfolio/`, and regenerates `src/portfolioPhotos.ts`. Until it has been
run, the page shows a short "gallery is being updated" message instead of a grid
of broken images, so it is safe to deploy either way.

If the network cannot reach Drive, download the folder by hand and point the
importer at it instead:

```bash
python3 scripts/import_portfolio_photos.py --from-dir ~/Downloads/miso-photos
```

To give a photo real alt text, add an `"alt"` key to its entry in
`scripts/portfolio-photos.json` and re-run the importer.
