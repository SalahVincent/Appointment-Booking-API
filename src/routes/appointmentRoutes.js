import express from 'express';
import { createAppointment, getMyAppointments, updateAppointmentStatus, cancelAppointment } from '../controllers/appointmentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getMyAppointments);
router.post('/', protect, authorize('client'), createAppointment);
router.patch('/:id/status', protect, authorize('provider'), updateAppointmentStatus);
router.patch('/:id/cancel', protect, cancelAppointment);

export default router;