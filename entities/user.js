const db = require('./db');
const tableName = 'users';

class User {
    userId;
    firstName;
    lastName;
    email;
    username;
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
                username: this.username,
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
}

module.exports = User;