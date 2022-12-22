const db = require('./db');
const tableName = 'clinics';

const _ = require('lodash');

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
                name: this.name,
                address: this.address,
                postal: this.postal,
                unit: this.unit,
                email: this.email,
                subEmail: this.subEmail ? this.subEmail : null,
                phone: this.phone,
                subPhone: this.subPhone ? this.subPhone : null
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