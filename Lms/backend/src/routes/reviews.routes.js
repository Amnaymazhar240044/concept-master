import express from 'express';
import { getAllReviews, addReview, getLatestReviews } from '../controllers/reviews.controller.js';

const router = express.Router();

router.get('/', getAllReviews);
router.post('/', addReview);
router.get('/latest', getLatestReviews);

export default router;
