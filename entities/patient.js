const bcrypt = require('bcryptjs');
const moment = require('moment');
const User = require('../entities/user');
const db = require('./db');
const tableName = 'patients';

const _ = require('lodash');

class Patient extends User {
    patientId;
    medicareId;
    address;
    postal;
    unit;
    familyId;
    userId;

    constructor(data) {
        super(data);
        Object.assign(this, data);
    }

    /**
     * Inserts a `user` and `patient` record.
     * Can be used for registration.
     * Returns: JSON Object
     * */
    async registerPatient() {
        const userId = await this.createUser();
        this.userId = userId;

        let result;
        try {
            result = await db(tableName).insert({
                medicareId: this.medicareId ? this.medicareId : null,
                address: this.address,
                postal: this.postal,
                unit: this.unit,
                familyId: this.familyId ? this.familyId : null,
                userId: this.userId
            });
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result;
    }

    /**
     * Retrieves all `patient` inner join `user` records
     * Returns: JSON[]
     * */
    async getAllPatients() {
        let result;
        try {
            result = await db(tableName).select('*')
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
     * Retrieves specific `patient` inner join `user` record
     * Returns: JSON Object
     * */
    async getPatient() {
        let result;
        try {
            result = await db(tableName).select('*')
                .innerJoin('users', 'patients.userId', 'users.userId')
                .where('patients.userId', this.userId);

            result = _.map(result, (patient) => {
                patient.DOB = moment(patient.DOB).format('YYYY-MM-DD');
                patient = _.omit(patient, 'password');
                return patient;
            });
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result[0];
    }

    async getProfile() {
        let result;
        try {
            result = await db(tableName).select('*')
                .innerJoin('users', 'patients.userId', 'users.userId')
                .where('patients.userId', this.userId);

            result = _.map(result, (patient) => {
                patient.DOB = moment(patient.DOB).format('YYYY-MM-DD');
                return patient;
            });
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result[0];
    }

    async getProfileByNRIC() {
        let result;
        try {
            result = await db(tableName).select('*')
                .innerJoin('users', tableName + '.userId', 'users.userId')
                .where('users.nric', this.nric);

            result = _.map(result, (patient) => {
                patient.DOB = moment(patient.DOB).format('YYYY-MM-DD');
                patient.nric = patient.nric[0] + "XXXX" + patient.nric.slice(5);
                return patient;
            });
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result[0];
    }

    /**
     * Retrieves a `patient` inner join `user` record and checks if password matches hash
     * Can be used for patient login authentication
     * Returns: JSON Object
     * */
    async authenticatePatient() {
        let result;
        let isMatch = false;
        try {
            result = await db(tableName).select('*')
                .innerJoin('users', 'patients.userId', 'users.userId')
                .where('email', this.email)
                .andWhere('isDeactivated', '0');

            if (Array.isArray(result) && result.length)
                isMatch = await bcrypt.compare(this.password, result[0].password);

            result = _.map(result, (patient) => {
                patient = _.omit(patient, 'password');
                patient.nric = patient.nric[0] + "XXXX" + patient.nric.slice(5);
                return patient;
            });
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return isMatch ? result[0] : {};
    }

    /**
     * Update a `patient` record
     * Can be used for update patient
     * Returns: Object
     * */
    async updatePatient() {
        await this.updateUser();

        let result;
        try {
            result = await db(tableName).update({
                medicareId: this.medicareId ? this.medicareId : null,
                address: this.address,
                postal: this.postal,
                unit: this.unit,
                familyId: this.familyId
            }).where('patientId', this.patientId);
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result;
    }
    async updateProfile() {
        await this.updateUserProfile();

        let result;
        try {
            result = await db(tableName).update({
                address: this.address,
                postal: this.postal,
                unit: this.unit
            }).where('patientId', this.patientId);
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result;
    }
}

module.exports = Patient;