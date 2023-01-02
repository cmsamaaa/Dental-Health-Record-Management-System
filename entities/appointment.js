const db = require('./db');
const tableName = 'appointments';

const _ = require('lodash');
const dateTimeFormat = require("../lib/dateTimeFormat");

class Appointment {
    apptId;
    startDateTime;
    endDateTime;
    followUpApptId;
    status;
    patientId;
    staffId;
    clinicId;

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
                apptId: this.apptId ? this.apptId : null,
                startDateTime: dateTimeFormat.parse(this.startDateTime),
                endDateTime: dateTimeFormat.parseWithAddition(this.startDateTime, 1, 30),
                followUpApptId: this.followUpApptId ? this.followUpApptId : null,
                patientId: this.patientId,
                staffId: this.staffId,
                clinicId: this.clinicId
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
    async getAllClinicAppointments() {
        let result;
        try {
            result = await db(tableName).select('*')
                .innerJoin('patients', 'appointments.patientId', 'patients.patientId')
                .innerJoin('users', 'patients.userId', 'users.userId')
                .innerJoin('clinics', 'appointments.clinicId', 'clinics.clinicId')
                .orderBy('startDateTime', 'asc');

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
     * Retrieves all `appointment` inner join `patient` and `user` records apptDateTime >= today
     * Returns: JSON[]
     * */
    async getAllUpcomingAppointments() {
        let result;
        try {
            result = await db(tableName).select('*')
                .innerJoin('patients', 'appointments.patientId', 'patients.patientId')
                .innerJoin('users', 'patients.userId', 'users.userId')
                .where('startDateTime', '>=', new Date())
                .andWhere('staffId', this.staffId)
                .orderBy('startDateTime', 'asc');

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
                .innerJoin('clinics', 'appointments.clinicId', 'clinics.clinicId')
                .where('patients.userId', this.userId)
                .orderBy('startDateTime', 'asc');

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
     * Retrieves one `appointment` inner join `patient` and `user` record
     * Returns: JSON Object
     * */
    async getAppointment() {
        let result;
        try {
            result = await db(tableName).select('*')
                .innerJoin('patients', 'appointments.patientId', 'patients.patientId')
                .innerJoin('users', 'patients.userId', 'users.userId')
                .where('apptId', this.apptId);

            result = _.map(result, (patient) => {
                return _.omit(patient, 'password');
            });
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result[0];
    }

    /**
     * Update a `appointment` record.
     * Can be used to update appointment.
     * Returns: Object
     * */
    async updateAppointment() {
        let result;
        try {
            result = await db(tableName).update({
                startDateTime: dateTimeFormat.parse(this.startDateTime),
                endDateTime: dateTimeFormat.parseWithAddition(this.startDateTime, 1, 30)
            }).where('apptId', this.apptId);
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result;
    }

    /**
     * Update a `appointment` record status to 'Cancelled'.
     * Can be used to suspend appointment.
     * Returns: Object
     * */
    async suspendAppointment() {
        let result;
        try {
            result = await db(tableName).update({
                status: 'Cancelled'
            }).where('apptId', this.apptId);
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result;
    }

    /**
     * Delete a `appointment` record.
     * Can be used to clear record after unit testing.
     * Returns: Object
     * */
    async deleteAppointment() {
        let result;
        try {
            result = await db(tableName).del()
                .where({
                    apptId: this.apptId
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