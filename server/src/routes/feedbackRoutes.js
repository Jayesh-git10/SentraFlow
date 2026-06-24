import express from 'express';
import { getFeedback , createFeedback , getUserFeedback, deleteFeedback} from '../controller/feedbackController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/',getFeedback);
router.post('/create',protect,createFeedback);
router.post('/user-feedback',protect,getUserFeedback);
router.delete('/:id',protect,deleteFeedback);
export default router
