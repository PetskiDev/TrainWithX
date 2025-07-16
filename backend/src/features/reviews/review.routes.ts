import { Router } from 'express';

import { doAuth } from '@src/middleware/auth';
import { deleteReviewHandler, postReview, putReview } from '@src/features/reviews/review.controller';

const router = Router();

//Get all reviews of some plan
router.get('/:planId', putReview);

router.post('/', doAuth, postReview);

router.put('/', doAuth, putReview);

router.delete('/:planId', doAuth, deleteReviewHandler);





export default router;
