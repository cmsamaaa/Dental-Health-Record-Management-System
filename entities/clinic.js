const db = require('./db');
const tableName = 'clinic';

class Clinic {
    clinicId;
    name;
    address;
    postal;
    unit;
    email;
    subEmail;
    phone;
    subPhone;

    constructor(data) {
        Object.assign(this, data);
    }

    /**
     * Inserts a `clinic` record.
     * Can be used to add a new clinic record.
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
     * Retrieves all `clinic` records
     * Returns: JSON[]
     * */
    async getAll() {
        let result;
        try {
            result = await db(tableName).select('*');
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result;
    }

    /**
     * Retrieves a specific `clinic` value by `clinicId`
     * Returns: JSON[]
     * */
    async get() {
        let result;
        try {
            result = await db(tableName).select('*').where('clinicId', this.clinicId);
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result[0] ? result[0] : {};
    }
}

module.exports = Clinic;