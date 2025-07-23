import { Router } from 'express';
import { editMyUsernameController, getMyUserController, uploadAvatarController } from '@src/features/users/user.controller';
import { doAuth } from '@src/middleware/auth';
import { getMyPurchasedPlansController } from '@src/features/plans/plan.controller';
import { multerImageUpload } from '@src/middleware/multer.uploads';

const router = Router();

router.get('/me', doAuth, getMyUserController);
router.get('/me/plans', doAuth, getMyPurchasedPlansController); //PLANS THAT AN USER OWNS
router.patch('/me/username', doAuth, editMyUsernameController);
router.patch(
    '/me/avatar', // must be logged in
    doAuth,
    multerImageUpload("avatar"), // Multer middleware
    uploadAvatarController
);

export default router;
