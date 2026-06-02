import { Appointment, Service, User, TimeSlot } from '../models/index.js';
import { Op } from 'sequelize'
import { getIO } from '../sockets/socketHandler.js'

export const createAppointment = async (req, res) => {
  try {
    const { serviceId, slotId } = req.body
    const clientId = req.user.id

    const slot = await TimeSlot.findByPk(slotId)
    if (!slot) {
      return res.status(404).json({ message: "Time slot not found." })
    }

    if (slot.isBooked) {
      return res.status(409).json({ message: "This time slot is already booked." })
    }

    const appointmentDate = new Date(slot.date); 

    if (appointmentDate < new Date().setHours(0,0,0,0)) {
      return res.status(400).json({ message: "You cannot book a time slot in the past." })
    }

    const existingAppointment = await Appointment.findOne({
      where: {
        serviceId,
        slotId,
        status: { [Op.ne]: 'cancelled' }
      }
    })

    if (existingAppointment) {
      return res.status(409).json({ message: "This time slot is already booked for this service." })
    }

    const service = await Service.findByPk(serviceId)
    if (!service) {
      return res.status(404).json({ message: 'Service not found' })
    }

    const appointment = await Appointment.create({
      serviceId,
      clientId,
      slotId,
      date: slot.date,
      status: 'pending'
    })

    slot.isBooked = true
    await slot.save()

    const io = getIO()
    io.to(`user_${service.providerId}`).emit('appointment_booked', {
      message: 'You have a new appointment booking time slot!',
      slotDetails: {
        date: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime
      },
      appointmentId: appointment.id,
      serviceId,
      date: slot.date
    })
    
    res.status(201).json(appointment)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getMyAppointments = async (req, res) => {
  try {
    const userId = req.user.id
    const userRole = req.user.role

    let appointments

    if (userRole === 'client') {

      appointments = await Appointment.findAll({
        where: { clientId: userId },
        include: [{ 
          model: Service, 
          as: 'service',
          include: [{ model: User, as: 'provider', attributes: ['name'] }] 
        }]
      })
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
      })
    }

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body
    const providerId = req.user.id

    const appointment = await Appointment.findByPk(id, {
      include: [{ model: Service, as: 'service' }]
    })

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' })
    }

    if (appointment.service.providerId !== providerId) {
      return res.status(403).json({ message: 'Not authorized to update this appointment' })
    }

    appointment.status = status
    await appointment.save()

    res.status(200).json({ message: `Appointment ${status}`, appointment })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const cancelAppointment = async (req, res, next) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    const appointment = await Appointment.findByPk(id, {
      include: [{ model: Service, as: 'service' }]
    })

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." })
    }

    const isClient = appointment.clientId === userId
    const isProvider = appointment.service.providerId === userId

    if (!isClient && !isProvider) {
      return res.status(403).json({ message: "Not authorized to cancel this appointment." })
    }

    appointment.status = 'cancelled'
    await appointment.save()

    if (appointment.slotId) {
      await TimeSlot.update({ isBooked: false }, { where: { id: appointment.slotId } })
    }

    try {
  const io = getIO()
  const providerId = appointment.service.providerId
  const clientId = appointment.clientId

  const notificationData = {
    message: `Appointment #${id} has been cancelled.`,
    appointmentId: id
  }

  io.to(`user_${clientId}`).emit('appointment_cancelled', notificationData)
  io.to(`user_${providerId}`).emit('appointment_cancelled', notificationData)
  
  console.log(`🚫 Cancellation alerts sent to Client ${clientId} and Provider ${providerId}`)
} catch (socketError) {
  console.error("Socket notification failed:", socketError.message)
}

    res.status(200).json({
      message: "Appointment cancelled successfully.",
      appointment
    })
  } catch (error) {
    next(error)
  }
}