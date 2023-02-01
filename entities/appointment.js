const db = require('./db');
const tableName = 'appointments';

const _ = require('lodash');
const moment = require('moment');
const dateTimeFormat = require("../lib/dateTimeFormat");

class Appointment {
    apptId;
    startDateTime;
    endDateTime;
    followUpApptId;
    status;     // Upcoming, In Session, Payment, Completed, Missed, Cancelled
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
     * Retrieves all `appointment` inner join `patient` and `user` records
     * Returns: JSON[]
     * */
    async getAllClinicAppointmentsByClinic() {
        let result;
        try {
            result = await db(tableName).select('*')
                .innerJoin('patients', 'appointments.patientId', 'patients.patientId')
                .innerJoin('users', 'patients.userId', 'users.userId')
                .innerJoin('clinics', 'appointments.clinicId', 'clinics.clinicId')
                .where(tableName + '.clinicId', this.clinicId)
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
                .where('startDateTime', '>=', moment(new Date()).format('YYYY-MM-DD 00:00:00'))
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
     * Retrieves all `appointment` inner join `patient` and `user` records apptDateTime >= today
     * Returns: JSON[]
     * */
    async getAllUpcomingAppointmentsByClinic() {
        let result;
        try {
            result = await db(tableName).select('*')
                .innerJoin('patients', 'appointments.patientId', 'patients.patientId')
                .innerJoin('users', 'patients.userId', 'users.userId')
                .where('startDateTime', '>=', moment(new Date()).format('YYYY-MM-DD 00:00:00'))
                .andWhere(tableName + '.clinicId', this.clinicId)
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
    async getUpcomingApptByClinicAndPatient() {
        let result;
        try {
            result = await db(tableName).select('*')
                .where('startDateTime', '>=', moment(new Date()).format('YYYY-MM-DD 00:00:00'))
                .andWhere('clinicId', this.clinicId)
                .andWhere('patientId', this.patientId)
                .orderBy('startDateTime', 'asc');

            result = _.map(result, (appt) => {
                appt.startDateTime = moment(appt.startDateTime).format('YYYY-MM-DD HH:mm:ss');
                appt.endDateTime = moment(appt.endDateTime).format('YYYY-MM-DD HH:mm:ss');
                return appt;
            });
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result;
    }

    /**
     * Retrieves all `appointment` inner join `patient` and `user` records apptDateTime < today
     * Returns: JSON[]
     * */
    async getAllPastAppointments() {
        let result;
        try {
            result = await db(tableName).select('*')
                .innerJoin('patients', 'appointments.patientId', 'patients.patientId')
                .innerJoin('users', 'patients.userId', 'users.userId')
                .where('startDateTime', '<', moment(new Date()).format('YYYY-MM-DD 00:00:00'))
                .andWhere('staffId', this.staffId)
                .orderBy('startDateTime', 'desc');

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
     * Retrieves all `appointment` inner join `patient` and `user` records apptDateTime < today
     * Returns: JSON[]
     * */
    async getAllPastAppointmentsByClinic() {
        let result;
        try {
            result = await db(tableName).select('*')
                .innerJoin('patients', 'appointments.patientId', 'patients.patientId')
                .innerJoin('users', 'patients.userId', 'users.userId')
                .where('startDateTime', '<', moment(new Date()).format('YYYY-MM-DD 00:00:00'))
                .andWhere(tableName + '.clinicId', this.clinicId)
                .orderBy('startDateTime', 'desc');

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
    async getAllUserUpcomingAppointments() {
        let result;
        try {
            result = await db(tableName).select('*')
                .innerJoin('patients', 'appointments.patientId', 'patients.patientId')
                .innerJoin('clinics', 'appointments.clinicId', 'clinics.clinicId')
                .where('patients.userId', this.userId)
                .andWhere('startDateTime', '>=', moment(new Date()).format('YYYY-MM-DD 00:00:00'))
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
     * Retrieves all `appointment` inner join `patient` and `user` records by `users.nric`
     * Returns: JSON[]
     * */
    async getAllUserUpcomingAppointments_NRIC(nric) {
        let result;
        try {
            result = await db(tableName).select('*')
                .innerJoin('patients', 'appointments.patientId', 'patients.patientId')
                .innerJoin('users', 'patients.userId', 'users.userId')
                .innerJoin('clinics', 'appointments.clinicId', 'clinics.clinicId')
                .where('users.nric', nric)
                .andWhere('startDateTime', '>=', moment(new Date()).format('YYYY-MM-DD 00:00:00'))
                .orderBy('startDateTime', 'asc');

            result = _.map(result, (appointment) => {
                appointment = _.omit(appointment, 'email');
                appointment = _.omit(appointment, 'nric');
                appointment = _.omit(appointment, 'DOB');
                appointment = _.omit(appointment, 'password');
                appointment = _.omit(appointment, 'verifiedEmail');
                appointment = _.omit(appointment, 'medicareId');
                appointment = _.omit(appointment, 'familyId');
                appointment = _.omit(appointment, 'profilePic');
                appointment = _.omit(appointment, 'isDeactivated');
                appointment = _.omit(appointment, 'address');
                appointment = _.omit(appointment, 'unit');
                appointment = _.omit(appointment, 'postal');
                appointment = _.omit(appointment, 'gender');
                appointment.startDateTime = moment(appointment.startDateTime).format('DD/MM/YYYY HH:mm');
                appointment.endDateTime = moment(appointment.endDateTime).format('DD/MM/YYYY HH:mm');
                return appointment;
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
    async getAllUserPastAppointments() {
        let result;
        try {
            result = await db(tableName).select('*')
                .innerJoin('patients', 'appointments.patientId', 'patients.patientId')
                .innerJoin('clinics', 'appointments.clinicId', 'clinics.clinicId')
                .where('patients.userId', this.userId)
                .andWhere('startDateTime', '<', moment(new Date()).format('YYYY-MM-DD 00:00:00'))
                .orderBy('startDateTime', 'desc');

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
                .innerJoin('clinics', 'appointments.clinicId', 'clinics.clinicId')
                .where('appointments.apptId', this.apptId);

            result = _.map(result, (appointment) => {
                appointment.startDateTime = moment(appointment.startDateTime).format('DD/MM/YYYY HH:mm');
                appointment.endDateTime = moment(appointment.endDateTime).format('DD/MM/YYYY HH:mm');
                appointment.DOB = moment(appointment.DOB).format('YYYY-MM-DD');
                appointment = _.omit(appointment, 'password');
                return appointment;
            });
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result[0];
    }

    /**
     * Retrieves one `appointment` inner join `patient` and `user` record with
     * Returns: JSON Object
     * */
    async getDentistCurrentAppointment() {
        let result;
        try {
            result = await db(tableName).select('*')
                .innerJoin('patients', 'appointments.patientId', 'patients.patientId')
                .innerJoin('users', 'patients.userId', 'users.userId')
                .where('staffId', this.staffId)
                .andWhere('status', 'In Session')
                .first();

            if (!_.isEmpty(result)) {
                result.DOB = moment(result.DOB).format('YYYY-MM-DD');
                result.startDateTime = moment(result.startDateTime).format('YYYY-MM-DD HH:mm');
                result.endDateTime = moment(result.endDateTime).format('YYYY-MM-DD HH:mm');
                result = _.omit(result, 'password');
            }
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result;
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
     * Update a `appointment` record status & staffId (if not null)
     * Can be used to update appointment.
     * Returns: 0 or 1
     * */
    async updateAppointmentStatus() {
        let result;
        try {
            if (this.staffId > 0)
                result = await db(tableName).update({
                    status: this.status,
                    staffId: this.staffId
                }).where('apptId', this.apptId);
            else
                result = await db(tableName).update({
                    status: this.status
                }).where('apptId', this.apptId);
        }
        catch (e) {
            console.error(e);
            result = 0;
        }

        return result;
    }

    /**
     * Update all `appointment` record status to `Missed` where endDateTime < today & status is `Upcoming`.
     * Can be used to update appointment.
     * Returns: Object
     * */
    async updateAllMissedAppointment() {
        let result;
        try {
            result = await db(tableName).update({
                status: 'Missed'
            }).where('endDateTime', '<', moment(new Date()).format('YYYY-MM-DD 00:00:00')).andWhere('status', 'Upcoming');
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