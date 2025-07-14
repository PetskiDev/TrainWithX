import {
  getAuthUser,
  getUserPlans as getOwnedPlans,
  editUsernameController,
  uploadAvatarController,
  getAuthCreator,
  getPlansMadeByCreator,
} from '@src/features/users/user.controller';
import { doAuth } from '@src/middleware/auth';
import { avatarUpload } from '@src/middleware/upload.avatar';
import { Router } from 'express';

const router = Router();

router.use(doAuth);

router.get('/', getAuthUser);
router.get('/creator', getAuthCreator);
router.get('/creator/plans', getPlansMadeByCreator); // Plans that some creator made
router.get('/plans', getOwnedPlans); //PLANS THAT AN USER OWNS
router.patch('/', editUsernameController); //USERNAME UPLOAD
router.post(
  '/avatar', // must be logged in
  avatarUpload, // Multer middleware
  uploadAvatarController
);

export default router;
