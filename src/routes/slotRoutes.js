import express from 'express';
import { createSlot, getAvailableSlots } from '../controllers/slotController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, authorize('provider'), createSlot);
router.get('/available', getAvailableSlots);

export default router;