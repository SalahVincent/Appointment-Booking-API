import express from 'express';
import { createService, getAllServices } from '../controllers/serviceController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllServices);
router.post('/', protect, authorize('provider'), createService);

export default router;