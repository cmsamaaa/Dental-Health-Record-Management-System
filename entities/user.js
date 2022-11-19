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
     * Retrieves a `user` record by matching email AND password column
     * Can be used for login authentication
     * */
    async authenticateUser() {
        let result;
        try {
            result = db(tableName)
                .select('userId', 'firstName', 'lastName', 'email', 'nric', 'DOB', 'profilePic')
                .where('email', this.email)
                .where('password', this.password);
        }
        catch (e) {
            console.error(e);
            result = {}
        }

        return result;
    }
}

module.exports = User;