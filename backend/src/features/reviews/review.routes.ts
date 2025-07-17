import { Router } from 'express';

import { doAuth } from '@src/middleware/auth';
import { deleteReviewHandler, getReviewController, postReview, putReview } from '@src/features/reviews/review.controller';

const router = Router();

//Get all reviews of some plan
router.get('/all/:planId'); //TODO

//Get the review of the logged in user to the plan
router.get('/:planId', doAuth, getReviewController);

router.post('/', doAuth, postReview);

router.put('/', doAuth, putReview);

router.delete('/:planId', doAuth, deleteReviewHandler);





export default router;
