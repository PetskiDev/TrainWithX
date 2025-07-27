import { Router } from 'express';
import { editMyUsernameController, getMyUserController, uploadAvatarController } from '@src/features/users/user.controller.js';
import { doAuth } from '@src/middleware/auth.js';
import { getMyPurchasedPlansController } from '@src/features/plans/plan.controller.js';
import { multerImageUpload } from '@src/middleware/multer.uploads.js';

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
