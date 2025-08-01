// utils/imageUploader.ts
import sharp from 'sharp';
import path, { dirname } from 'path';
import fs from 'fs/promises';
import { AppError } from './AppError.js';
import { fileURLToPath } from 'url';

interface ImageStoreOptions {
  id: number;
  file: Express.Multer.File;
  folder: string;
  width: number;
  height: number;
  oldFileUrl?: string;
}

export const storeInUploads = async ({
  id,
  file,
  folder,
  width,
  height,
  oldFileUrl,
}: ImageStoreOptions): Promise<string> => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  const DIR = path.join(__dirname, '..', '..', 'uploads', folder);

  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowed.includes(file.mimetype))
    throw new AppError('Unsupported image type', 400);

  await fs.mkdir(DIR, { recursive: true });
  const filename = `${id}_${Date.now()}.webp`;
  const target = path.join(DIR, filename);

  const buffer = await sharp(file.buffer)
    .rotate()
    .resize(width, height, {
      fit: 'cover', // crop instead of fitting
      position: 'center', // crop from the center
    })
    .webp({ quality: 80 })
    .toBuffer();

  try {
    await fs.writeFile(target, buffer);
  } catch (err) {
    console.error('Failed to write image to disk:', err);
    throw new AppError('Internal server error while saving image', 500);
  }

  if (oldFileUrl) {
    const oldFilename = path.basename(oldFileUrl);
    const oldPath = path.join(DIR, oldFilename);
    try {
      await fs.unlink(oldPath);
    } catch (err: any) {
      if (err.code !== 'ENOENT')
        console.error('Failed to delete old image:', err);
    }
  }

  const relative = `/uploads/${folder}/${filename}`;

  return relative;
};
