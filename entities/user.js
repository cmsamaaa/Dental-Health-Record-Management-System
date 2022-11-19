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
    profilePic;

    constructor(data) {
        Object.assign(this, data);
    }

    /**
     * Inserts a `user` record
     * Can be used for registration
     * Returns: User
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
                DOB: this.DOB
            });
        }
        catch (e) {
            console.error(e);
            result = {}
        }

        return result;
    }

    /**
     * Retrieves a `user` record and checks if password matches hash
     * Can be used for login authentication
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

        return isMatch ? {userId: result[0].userId} : {};
    }
}

module.exports = User;