import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { readFileSync, readdirSync, statSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const s3Client = new S3Client({
  region: "us-east-1",
});

const BUCKET_NAME = "miso-marketing";
const DIST_DIR = path.join(__dirname, "../dist");
const ASSETS_MARKETING_PICTURES = path.join(
  __dirname,
  "../src/assets/marketing pictures"
);
const ASSETS_MARKETING_SPREAD = path.join(
  __dirname,
  "../src/assets/marketingSpread"
);

const getContentType = (filePath) => {
  const ext = filePath.split(".").pop().toLowerCase();
  const contentTypes = {
    html: "text/html",
    css: "text/css",
    js: "application/javascript",
    json: "application/json",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    svg: "image/svg+xml",
    ico: "image/x-icon",
    ttf: "font/ttf",
    woff: "font/woff",
    woff2: "font/woff2",
    eot: "application/vnd.ms-fontobject",
    otf: "font/otf",
  };
  return contentTypes[ext] || "application/octet-stream";
};

const uploadFile = async (filePath) => {
  try {
    const fileContent = readFileSync(filePath);
    const key = filePath.replace(DIST_DIR + "/", "");
    const contentType = getContentType(filePath);

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: fileContent,
      ContentType: contentType,
    });

    await s3Client.send(command);
    console.log(`Uploaded: ${key}`);
  } catch (error) {
    console.error(`Error uploading ${filePath}:`, error);
  }
};

const uploadDirectory = async (dirPath) => {
  const files = readdirSync(dirPath);

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = statSync(filePath);

    if (stat.isDirectory()) {
      await uploadDirectory(filePath);
    } else {
      await uploadFile(filePath);
    }
  }
};

const uploadDirectoryToS3 = async (localDir, s3Prefix = "") => {
  const files = readdirSync(localDir);
  for (const file of files) {
    const filePath = path.join(localDir, file);
    const stat = statSync(filePath);
    if (stat.isDirectory()) {
      await uploadDirectoryToS3(filePath, s3Prefix + file + "/");
    } else {
      // Compose the S3 key
      const key = s3Prefix + file;
      try {
        const fileContent = readFileSync(filePath);
        const contentType = getContentType(filePath);
        const command = new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: key,
          Body: fileContent,
          ContentType: contentType,
        });
        await s3Client.send(command);
        console.log(`Uploaded: ${key}`);
      } catch (error) {
        console.error(`Error uploading ${filePath}:`, error);
      }
    }
  }
};

const deploy = async () => {
  console.log("Starting deployment...");
  await uploadDirectory(DIST_DIR);
  // Upload marketing pictures
  await uploadDirectoryToS3(ASSETS_MARKETING_PICTURES, "marketing-pictures/");
  await uploadDirectoryToS3(ASSETS_MARKETING_SPREAD, "marketingSpread/");
  console.log("Deployment completed successfully!");
};

deploy().catch(console.error);
