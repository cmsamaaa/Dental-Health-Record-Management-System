const db = require('./db');
const tableName = 'clinics';

const _ = require('lodash');

class Clinic {
    clinicId;
    clinicName;
    clinicAddress;
    clinicPostal;
    clinicUnit;
    clinicEmail;
    clinicSubEmail;
    clinicPhone;
    clinicSubPhone;

    constructor(data) {
        Object.assign(this, data);
    }

    /**
     * Inserts a `clinic` record.
     * Can be used to add a new clinic record.
     * Returns: Object
     * */
    async registerClinic() {

        let result;
        try {
            result = await db(tableName).insert({
                clinicName: this.clinicName,
                clinicAddress: this.clinicAddress,
                clinicPostal: this.clinicPostal,
                clinicUnit: this.clinicUnit,
                clinicEmail: this.clinicEmail,
                clinicSubEmail: this.clinicSubEmail ? this.clinicSubEmail : null,
                clinicPhone: this.clinicPhone,
                clinicSubPhone: this.clinicSubPhone ? this.clinicSubPhone : null
            });
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result[0];
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
     * Retrieves all `clinic` records inner join `staff` role dentists
     * Returns: JSON[]
     * */
    async getAllDentists() {
        let result;
        try {
            result = await db(tableName).select('*')
                .innerJoin('staffs', 'clinics.clinicId', 'staffs.clinicId')
                .innerJoin('users', 'staffs.userId', 'users.userId')
                .where('clinics.clinicId', this.clinicId)
                .andWhere('staffs.role', 'Dentist');

            result = _.map(result, (staff) => {
                staff = _.omit(staff, 'password');
                staff.nric = staff.nric[0] + "XXXX" + staff.nric.slice(5);
                return staff;
            });
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

    /**
     * Update a `clinic` record
     * Can be used for update clinic information
     * Returns: Object
     * */
    async updateClinic() {
        let result;
        try {
            result = await db(tableName).update({
                clinicName: this.clinicName,
                clinicAddress: this.clinicAddress,
                clinicPostal: this.clinicPostal,
                clinicUnit: this.clinicUnit,
                clinicEmail: this.clinicEmail,
                clinicSubEmail: this.clinicSubEmail ? this.clinicSubEmail : null,
                clinicPhone: this.clinicPhone,
                clinicSubPhone: this.clinicSubPhone ? this.clinicSubPhone : null
            }).where('clinicId', this.clinicId);
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result;
    }
}

module.exports = Clinic;