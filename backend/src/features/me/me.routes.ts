import {
  getMyUserController,
  editMyUsernameController,
  uploadAvatarController,
} from '@src/features/users/user.controller';
import { getMyPurchasedPlansController } from '../plans/plan.controller';
import { getMyCreatedPlansController } from '../plans/plan.controller';
import { getMyCreatorController as getMyCreatorController } from '../creators/creator.controller';
import { doAuth } from '@src/middleware/auth';
import { avatarUpload } from '@src/middleware/upload.avatar';
import { Router } from 'express';

const router = Router();

router.use(doAuth);

router.get('/', getMyUserController);
router.get('/creator', getMyCreatorController);
router.get('/creator/plans', getMyCreatedPlansController); // Plans that some creator made
router.get('/plans', getMyPurchasedPlansController); //PLANS THAT AN USER OWNS
router.patch('/', editMyUsernameController); //TODO: change to username or smth
router.post(
  '/avatar', // must be logged in
  avatarUpload, // Multer middleware
  uploadAvatarController
);

export default router;
