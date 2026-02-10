import { Appointment, Service, User } from '../models/index.js';

export const createAppointment = async (req, res) => {
  try {
    const { serviceId, date } = req.body;
    const clientId = req.user.id;

    const appointment = await Appointment.create({
      serviceId,
      clientId,
      date
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