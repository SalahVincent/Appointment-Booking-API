import { Appointment, Service, User } from '../models/index.js';
import { Op } from 'sequelize'

export const createAppointment = async (req, res) => {
  try {
    const { serviceId, date } = req.body;
    const clientId = req.user.id;
    const appointmentDate = new Date(date);

    if (appointmentDate < new Date()) {
      return res.status(400).json({ message: "You cannot book an appointment in the past." });
    }

    const existingAppointment = await Appointment.findOne({
      where: {
        serviceId,
        date: appointmentDate,
        status: { [Op.ne]: 'cancelled' }
      }
    });

    if (existingAppointment) {
      return res.status(409).json({ message: "This time slot is already booked for this service." });
    }

    const appointment = await Appointment.create({
      serviceId,
      clientId,
      date: appointmentDate
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const getMyAppointments = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let appointments;

    if (userRole === 'client') {

      appointments = await Appointment.findAll({
        where: { clientId: userId },
        include: [{ 
          model: Service, 
          as: 'service',
          include: [{ model: User, as: 'provider', attributes: ['name'] }] 
        }]
      });
    } else {

      appointments = await Appointment.findAll({
        include: [{
          model: Service,
          as: 'service',
          where: { providerId: userId }
        }, {
          model: User,
          as: 'client',
          attributes: ['name', 'email']
        }]
      });
    }

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const providerId = req.user.id;

    const appointment = await Appointment.findByPk(id, {
      include: [{ model: Service, as: 'service' }]
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.service.providerId !== providerId) {
      return res.status(403).json({ message: 'Not authorized to update this appointment' });
    }

    appointment.status = status;
    await appointment.save();

    res.status(200).json({ message: `Appointment ${status}`, appointment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const cancelAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const appointment = await Appointment.findByPk(id, {
      include: [{ model: Service, as: 'service' }]
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    const isClient = appointment.clientId === userId;
    const isProvider = appointment.service.providerId === userId;

    if (!isClient && !isProvider) {
      return res.status(403).json({ message: "Not authorized to cancel this appointment." });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.status(200).json({
      message: "Appointment cancelled successfully.",
      appointment
    });
  } catch (error) {
    next(error);
  }
};