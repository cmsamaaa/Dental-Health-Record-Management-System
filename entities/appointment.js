const db = require('./db');
const tableName = 'appointments';

const _ = require('lodash');
const dateTimeFormat = require("../lib/dateTimeFormat");

class Appointment {
    apptId;
    apptDateTime;
    followUpApptId;
    patientId;

    constructor(data) {
        Object.assign(this, data);
    }

    /**
     * Inserts a `appointment` record.
     * Can be used for create appointment.
     * Returns: Object
     * */
    async createAppointment() {
        let result;
        try {
            result = await db(tableName).insert({
                apptDateTime: dateTimeFormat.parse(this.apptDateTime),
                followUpApptId: this.followUpApptId ? this.followUpApptId : null,
                patientId: this.patientId
            });
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result;
    }

    /**
     * Retrieves all `appointment` inner join `patient` and `user` records
     * Returns: JSON[]
     * */
    async getAllAppointments() {
        let result;
        try {
            result = await db(tableName).select('*')
                .innerJoin('patients', 'appointments.patientId', 'patients.patientId')
                .innerJoin('users', 'patients.userId', 'users.userId');

            result = _.map(result, (patient) => {
                return _.omit(patient, 'password');
            });
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result;
    }

    /**
     * Retrieves all `appointment` inner join `patient` and `user` records by `userId`
     * Returns: JSON[]
     * */
    async getAllUserAppointments() {
        let result;
        try {
            result = await db(tableName).select('*')
                .innerJoin('patients', 'appointments.patientId', 'patients.patientId')
                .innerJoin('users', 'patients.userId', 'users.userId')
                .where('patients.userId', this.userId);

            result = _.map(result, (patient) => {
                return _.omit(patient, 'password');
            });
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result;
    }
}

module.exports = Appointment;