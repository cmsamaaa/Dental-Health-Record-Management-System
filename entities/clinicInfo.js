const db = require('./db');
const tableName = 'clinic_info';

class ClinicInfo {
    infoKey;
    value;

    constructor(data) {
        Object.assign(this, data);
    }

    /**
     * Inserts a `clinic_info` record.
     * Can be used to add a new clinic info record.
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
     * Retrieves all `clinic_info` records
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
     * Retrieves a specific `clinic_info` value by key
     * Returns: JSON[]
     * */
    async get() {
        let result;
        try {
            result = await db(tableName).select('*').where('infoKey', this.infoKey);
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result[0] ? result[0] : {};
    }
}

module.exports = ClinicInfo;