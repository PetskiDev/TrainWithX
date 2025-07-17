import { promoteToCreatorController } from '../creators/creator.controller';
import { Router } from 'express';
import { editMyUsernameController, getMyUserController, uploadAvatarController } from '@src/features/users/user.controller';
import { doAuth } from '@src/middleware/auth';
import { getMyPurchasedPlansController } from '@src/features/plans/plan.controller';
import { avatarUpload } from '@src/middleware/upload.avatar';

const router = Router();

router.get('/me', doAuth, getMyUserController);
router.get('/me/plans', doAuth, getMyPurchasedPlansController); //PLANS THAT AN USER OWNS
router.patch('/me/username', doAuth, editMyUsernameController);
router.post(
    '/me/avatar', // must be logged in
    doAuth,
    avatarUpload, // Multer middleware
    uploadAvatarController
);

router.patch('/:id/promote-creator', promoteToCreatorController); //TODO

export default router;
