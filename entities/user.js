const bcrypt = require('bcryptjs');
const db = require('./db');
const tableName = 'users';

class User {
    userId;
    firstName;
    lastName;
    email;
    password;
    nric;
    DOB;
    gender;
    profilePic;
    verifiedEmail;
    isDeactivated;

    constructor(data) {
        Object.assign(this, data);
    }

    /**
     * Inserts a `user` record
     * Can be used for registration
     * Returns: Object
     * */
    async createUser() {
        let result;
        try {
            result = await db(tableName).insert({
                firstName: this.firstName,
                lastName: this.lastName,
                email: this.email,
                password: this.password,
                nric: this.nric,
                DOB: this.DOB,
                gender: this.gender
            });
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result;
    }

    /**
     * Update a `user` record
     * Can be used for update staff/patient
     * Returns: Object
     * */
    async updateUser() {
        let result;
        try {
            result = await db(tableName).update({
                firstName: this.firstName,
                lastName: this.lastName,
                email: this.email,
                nric: this.nric,
                DOB: this.DOB,
                gender: this.gender
            }).where('userId', this.userId);
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result;
    }

    async updateUserProfile() {
        let result;
        try {
            const hashedPassword = await bcrypt.hash(this.password, 12);
            result = await db(tableName).update({
                firstName: this.firstName,
                lastName: this.lastName,
                email: this.email,
                password: hashedPassword,
                DOB: this.DOB
            }).where('userId', this.userId);
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result;
    }

    /**
     * Update a `user` record `isDeactivated` to 1
     * Can be used for account suspension
     * Returns: Object
     * */
    async suspendUser() {
        let result;
        try {
            result = await db(tableName).update({
                isDeactivated: 1
            }).where('userId', this.userId);
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result;
    }

    /**
     * Update a `user` record `isDeactivated` to 0
     * Can be used for account reactivation
     * Returns: Object
     * */
    async reactivateUser() {
        let result;
        try {
            result = await db(tableName).update({
                isDeactivated: 0
            }).where('userId', this.userId);
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result;
    }
}

module.exports = User;