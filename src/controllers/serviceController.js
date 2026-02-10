import { User, Service } from '../models/index.js'

export const createService = async (req, res) => {
  try {
    const { name, description, price, duration } = req.body;

    const newService = await Service.create({
      name,
      description,
      price,
      duration,
      providerId: req.user.id 
    });

    res.status(201).json({
      message: "Service created successfully!",
      service: newService
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllServices = async (req, res) => {
  try {
    const services = await Service.findAll({
      include: [{
        model: User,
        as: 'provider',
        attributes: ['id', 'name', 'email']
      }]
    });
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};