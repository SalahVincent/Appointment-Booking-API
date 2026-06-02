import { TimeSlot, User } from "../models/index.js";

export const createSlot = async (req, res) => {
    try {
        const { date, startTime, endTime } = req.body;
        const providerId = req.user.id;

        const existingSlot = await TimeSlot.findOne({
            where: {
                providerId,
                date,
                startTime,
                endTime
            }
        });

        if (existingSlot) {
            return res.status(400).json({ message: 'Time slot already exists' });
        }

        const newSlot = await TimeSlot.create({
            date,
            startTime,
            endTime,
            providerId,
            isBooked: false
        });
        res.status(201).json({ message: 'Time slot created successfully', slot: newSlot });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getAvailableSlots = async (req, res) => {
    try {
        const { providerId, date } = req.query;

        const whereClause = { isBooked: false };
        if (providerId) whereClause.providerId = providerId;
        if (date) whereClause.date = date;

        const slots = await TimeSlot.findAll({
            where: whereClause,
            include: [{ model: User, as: 'provider', attributes: ['id', 'name'] }]
        });
        res.status(200).json({ slots });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}