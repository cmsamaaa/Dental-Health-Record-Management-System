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
     * Retrieves a `user` record and checks if password matches hash
     * Can be used for login authentication
     * Returns: JSON
     * */
    async authenticateUser() {
        let result;
        let isMatch = false;
        try {
            result = await db(tableName).select('*').where('email', this.email);

            if (Array.isArray(result) && result.length)
                isMatch = await bcrypt.compare(this.password, result[0].password);
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return isMatch ? { userId: result[0].userId } : {};
    }

    /**
     * Retrieves all `user` userId and NRIC records
     * Returns: JSON[]
     * */
    async getAllNRIC() {
        let result;
        try {
            result = await db(tableName).select('userId', 'nric').where('isDeactivated', 0);
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result;
    }
}

module.exports = User;