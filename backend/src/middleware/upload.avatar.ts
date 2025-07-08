import multer from 'multer';

export const avatarUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = ['image/jpeg', 'image/png', 'image/webp'].includes(
      file.mimetype
    );
    cb(null, ok);
  },
}).single('avatar');
