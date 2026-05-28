import express from 'express';
import { getFeedback , createFeedback } from '../controller/feedbackController.js';
const router = express.Router();

router.get('/',getFeedback);
router.post('/create', createFeedback);

export default router
