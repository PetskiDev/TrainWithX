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



export default router;
