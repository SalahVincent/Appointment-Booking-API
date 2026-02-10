import User from './user.js';
import Service from './service.js';
import Appointment from './appointment.js';


User.hasMany(Service, { foreignKey: 'providerId', as: 'services' });
Service.belongsTo(User, { foreignKey: 'providerId', as: 'provider' });

User.hasMany(Appointment, { foreignKey: 'clientId', as: 'appointments'})
Appointment.belongsTo(User, { foreignKey: 'clientId', as: 'client'})

Service.hasMany(Appointment, { foreignKey: 'serviceId', as: 'appointments'})
Appointment.belongsTo(Service, { foreignKey: 'serviceId', as: 'service'})

export { Appointment, User, Service };