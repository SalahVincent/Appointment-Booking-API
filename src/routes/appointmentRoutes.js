import express from 'express';
import { createAppointment, getMyAppointments } from '../controllers/appointmentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getMyAppointments);
router.post('/', protect, authorize('client'), createAppointment);

export default router;