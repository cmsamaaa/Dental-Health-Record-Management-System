const bcrypt = require('bcryptjs');
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
     * Returns: Object
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
                familyId: this.familyId > 0 ? this.familyId : 0,
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
            result = await db(tableName).select('*').innerJoin('users', 'patients.userId', 'users.userId');

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
     * Returns: JSON
     * */
    async getPatient() {
        let result;
        try {
            result = await db(tableName).select('*').innerJoin('users', 'patients.userId', 'users.userId').where('patients.userId', this.userId);

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
     * Retrieves a `patient` inner join `user` record and checks if password matches hash
     * Can be used for patient login authentication
     * Returns: JSON
     * */
    async authenticatePatient() {
        let result;
        let isMatch = false;
        try {
            result = await db(tableName).select('*').innerJoin('users', 'patients.userId', 'users.userId').where('email', this.email);

            if (Array.isArray(result) && result.length)
                isMatch = await bcrypt.compare(this.password, result[0].password);
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return isMatch ? { userId: result[0].userId } : {};
    }
}

module.exports = Patient;