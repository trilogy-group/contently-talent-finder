import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(__dirname, '../public/favicon.svg');
const outputPath = path.join(__dirname, '../public/favicon.ico');

// Create favicon using the 32x32 size which is standard
sharp(inputPath)
  .resize(32, 32)
  .toFile(outputPath)
  .then(() => {
    console.log('Favicon generated successfully!');
  })
  .catch(err => {
    console.error('Error generating favicon:', err);
  });
