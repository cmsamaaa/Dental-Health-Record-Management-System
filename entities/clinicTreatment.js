const db = require('./db');
const tableName = 'clinic_treatments';

const _ = require('lodash');

class ClinicTreatment {
    ctId;
    ctName;
    ctPrice;
    clinicId;

    constructor(data) {
        Object.assign(this, data);
    }

    /**
     * Inserts a `clinic_treatments` record.
     * Can be used to add a new clinic treatment record.
     * Returns: Object
     * */
    async add() {
        let result;
        try {
            result = await db(tableName).insert(this);
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result;
    }

    /**
     * Retrieves all `clinic_treatments` records by `clinicId`
     * Returns: JSON[]
     * */
    async getAll() {
        let result;
        try {
            result = await db(tableName).select('*').where('clinicId', this.clinicId);
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result;
    }

    /**
     * Retrieves a specific `clinic_treatments` value by `ctId`
     * Returns: JSON[]
     * */
    async get() {
        let result;
        try {
            result = await db(tableName).select('*').where('ctId', this.ctId);
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result[0] ? result[0] : {};
    }

    /**
     * Update a `clinic_treatments` record
     * Can be used for update clinic treatment information
     * Returns: Object
     * */
    async updateClinicTreatment() {
        let result;
        try {
            result = await db(tableName).update({
                ctName: this.ctName,
                ctPrice: this.ctPrice
            }).where('ctId', this.ctId);
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result;
    }
}

module.exports = ClinicTreatment;