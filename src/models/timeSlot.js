import {DataTypes} from 'sequelize';
import sequelize from '../config/db.js';

const TimeSlot = sequelize.define('timeSlot', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    startTime: {
        type: DataTypes.TIME,
        allowNull: false
    },
    endTime: {
        type: DataTypes.TIME,
        allowNull: false
    },
    isBooked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    providerId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
    }, {
        tableName: 'time_slots',
        underscored: true,
        timestamps: false
    });

    export default TimeSlot;