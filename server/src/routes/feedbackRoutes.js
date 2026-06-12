import express from 'express';
import { getFeedback , createFeedback , getUserFeedback} from '../controller/feedbackController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/',protect,getFeedback);
router.post('/create',protect,createFeedback);
router.post('/user-feedback',protect,getUserFeedback)
export default router
