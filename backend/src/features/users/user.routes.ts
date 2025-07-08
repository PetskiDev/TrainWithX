import {
  getAuthUser,
  getUser,
  getUserPlans as getOwnedPlans,
  getUsers,
  promoteToCreator,
  editUsernameController,
  uploadAvatarController,
} from '@src/features/users/user.controller';
import { doAuth } from '@src/middleware/auth';
import { avatarUpload } from '@src/middleware/upload.avatar';
import { Router } from 'express';

const router = Router();

router.get('/', getUsers);
router.get('/me', doAuth, getAuthUser);
router.get('/me/plans', doAuth, getOwnedPlans); //PLANS THAT AN USER OWNS
router.patch('/me', doAuth, editUsernameController); //USERNAME UPLOAD
router.post(
  '/me/avatar',
  doAuth, // must be logged in
  avatarUpload, // Multer middleware
  uploadAvatarController
);

router.get('/:id', getUser);

router.patch('/:id/promote-creator', promoteToCreator); //TODO

export default router;
