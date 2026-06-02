import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const User = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('client', 'provider'),
    defaultValue: 'client',
  },
}, {
  tableName: 'users',
  underscored: true,
  timestamps: true,
});

export default User;