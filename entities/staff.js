const _ = require('lodash');
const bcrypt = require('bcryptjs');
const moment = require('moment');

const User = require('../entities/user');
const db = require('./db');
const tableName = 'staffs';

class Staff extends User {
    staffId;
    role;
    userId;
    clinicId;

    constructor(data) {
        super(data);
        Object.assign(this, data);
    }

    /**
     * Inserts a `user` and `staff` record.
     * Can be used for registration.
     * Returns: JSON Object
     * */
    async registerStaff() {
        const userId = await this.createUser();
        this.userId = userId;

        let result;
        try {
            result = await db(tableName).insert({
                role: this.role,
                userId: this.userId,
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
     * Retrieves all `staff` inner join `user` records
     * Returns: JSON[]
     * */
    async getAllStaffs() {
        let result;
        try {
            result = await db(tableName).select('*').innerJoin('users', 'staffs.userId', 'users.userId').where('clinicId', this.clinicId);

            result = _.map(result, (staff) => {
                return _.omit(staff, 'password');
            });
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result;
    }

    /**
     * Retrieves specific `staff` inner join `user` record
     * Returns: JSON Object
     * */
    async getStaff() {
        let result;
        try {
            result = await db(tableName).select('*').innerJoin('users', 'staffs.userId', 'users.userId').where('staffs.userId', this.userId);

            result = _.map(result, (staff) => {
                staff.DOB = moment(staff.DOB).format('YYYY-MM-DD');
                staff = _.omit(staff, 'password');
                return staff;
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
            result = await db(tableName).select('*').innerJoin('users', 'staffs.userId', 'users.userId').where('staffs.userId', this.userId);

            result = _.map(result, (staff) => {
                staff.DOB = moment(staff.DOB).format('YYYY-MM-DD');
                return staff;
            });
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result[0];
    }

    /**
     * Retrieves specific `staff` inner join `user` record by staffId
     * Returns: JSON Object
     * */
    async getDentist() {
        let result;
        try {
            result = await db(tableName).select('*')
                .innerJoin('users', 'staffs.userId', 'users.userId')
                .innerJoin('clinics', 'staffs.clinicId', 'clinics.clinicId')
                .where('staffs.staffId', this.staffId)
                .andWhere('staffs.role', 'Dentist');

            result = _.map(result, (staff) => {
                staff.DOB = moment(staff.DOB).format('YYYY-MM-DD');
                staff = _.omit(staff, 'password');
                return staff;
            });
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result[0];
    }

    /**
     * Retrieves a `staff` inner join `user` record and checks if password matches hash
     * Can be used for staff login authentication
     * Returns: JSON Object
     * */
    async authenticateStaff() {
        let result;
        let isMatch = false;
        try {
            result = await db(tableName).select('*')
                .innerJoin('users', 'staffs.userId', 'users.userId')
                .where('email', this.email)
                .andWhere('isDeactivated', '0');

            if (Array.isArray(result) && result.length)
                isMatch = await bcrypt.compare(this.password, result[0].password);

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

        return isMatch ? result[0] : {};
    }

    /**
     * Update a `staff` record
     * Can be used for update staff
     * Returns: Object
     * */
    async updateStaff() {
        await this.updateUser();

        let result;
        try {
            result = await db(tableName).update({
                role: this.role
            }).where('staffId', this.staffId);
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result;
    }
}

module.exports = Staff;