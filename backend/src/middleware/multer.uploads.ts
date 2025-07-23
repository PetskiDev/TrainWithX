import multer from 'multer';


export const multerImageUpload = (fieldName: string, maxSizeMB = 10) => {
  return multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: maxSizeMB * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
      const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      cb(null, allowed.includes(file.mimetype));
    },
  }).single(fieldName);
};