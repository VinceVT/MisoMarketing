import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const s3Client = new S3Client({
  region: "us-east-1", // Change this to your region
});

const SOURCE_DIR = path.join(__dirname, "../src/assets/marketing pictures");
const OPTIMIZED_DIR = path.join(__dirname, "../optimized-images");

// Create optimized directory if it doesn't exist
if (!fs.existsSync(OPTIMIZED_DIR)) {
  fs.mkdirSync(OPTIMIZED_DIR);
}

async function optimizeImage(filePath) {
  const fileName = path.basename(filePath);
  const outputPath = path.join(OPTIMIZED_DIR, fileName);

  try {
    await sharp(filePath)
      .resize(1920, 1080, {
        // Max dimensions
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality: 80 }) // Adjust quality as needed
      .toFile(outputPath);

    console.log(`Optimized: ${fileName}`);
    return outputPath;
  } catch (error) {
    console.error(`Error optimizing ${fileName}:`, error);
    return null;
  }
}

async function uploadToS3(filePath) {
  const fileName = path.basename(filePath);
  const fileContent = fs.readFileSync(filePath);

  const params = {
    Bucket: "miso-marketing",
    Key: `marketing-pictures/${fileName}`,
    Body: fileContent,
    ContentType: "image/jpeg",
    ACL: "public-read",
  };

  try {
    await s3Client.send(new PutObjectCommand(params));
    console.log(`Uploaded: ${fileName}`);
  } catch (error) {
    console.error(`Error uploading ${fileName}:`, error);
  }
}

async function processImages() {
  const files = fs.readdirSync(SOURCE_DIR);

  for (const file of files) {
    if (
      file.toLowerCase().endsWith(".jpg") ||
      file.toLowerCase().endsWith(".jpeg")
    ) {
      const filePath = path.join(SOURCE_DIR, file);
      const optimizedPath = await optimizeImage(filePath);

      if (optimizedPath) {
        await uploadToS3(optimizedPath);
        // Clean up optimized file
        fs.unlinkSync(optimizedPath);
      }
    }
  }

  // Clean up optimized directory
  fs.rmdirSync(OPTIMIZED_DIR);
}

processImages().catch(console.error);
