import User from './user.js';
import Service from './service.js';
import Appointment from './appointment.js';
import TimeSlot from './timeSlot.js';


User.hasMany(Service, { foreignKey: 'providerId', as: 'services' });
Service.belongsTo(User, { foreignKey: 'providerId', as: 'provider' });

User.hasMany(Appointment, { foreignKey: 'clientId', as: 'appointments'})
Appointment.belongsTo(User, { foreignKey: 'clientId', as: 'client' })

Service.hasMany(Appointment, { foreignKey: 'serviceId', as: 'appointments'})
Appointment.belongsTo(Service, { foreignKey: 'serviceId', as: 'service'})

User.hasMany(TimeSlot, { foreignKey: 'providerId', as: 'slots' });
TimeSlot.belongsTo(User, { foreignKey: 'providerId', as: 'provider' });

TimeSlot.hasOne(Appointment, { foreignKey: 'slotId', as: 'appointment' });
Appointment.belongsTo(TimeSlot, { foreignKey: 'slotId', as: 'timeSlot' });

export { Appointment, User, Service, TimeSlot };