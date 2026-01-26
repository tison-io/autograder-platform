import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

// Allowed image MIME types
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

// Max file size: 5MB
export const MAX_AVATAR_SIZE = 5 * 1024 * 1024;

// Upload directory for avatars
export const AVATAR_UPLOAD_DIR = join(process.cwd(), 'uploads', 'avatars');

// Ensure upload directory exists
export const ensureUploadDirExists = () => {
  if (!existsSync(AVATAR_UPLOAD_DIR)) {
    mkdirSync(AVATAR_UPLOAD_DIR, { recursive: true });
  }
};

// Filter for image files only
export const imageFileFilter = (
  req: any,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    return callback(
      new BadRequestException('Only image files (JPEG, PNG, GIF, WebP) are allowed'),
      false,
    );
  }
  callback(null, true);
};

// Custom storage for avatars
export const avatarStorage = diskStorage({
  destination: (req, file, callback) => {
    ensureUploadDirExists();
    callback(null, AVATAR_UPLOAD_DIR);
  },
  filename: (req, file, callback) => {
    // Generate unique filename: userId-uuid.ext
    const userId = (req as any).user?.id || 'unknown';
    const uniqueSuffix = uuidv4();
    const ext = extname(file.originalname).toLowerCase();
    const filename = `${userId}-${uniqueSuffix}${ext}`;
    callback(null, filename);
  },
});

// Multer options for avatar upload
export const avatarUploadOptions = {
  storage: avatarStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: MAX_AVATAR_SIZE,
  },
};
