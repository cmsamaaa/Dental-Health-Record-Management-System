const bcrypt = require('bcryptjs');
const db = require('./db');
const tableName = 'users';
const moment = require('moment');

class Profile {
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
     * Update a `user` record
     * Can be used for update staff/patient profile
     * Returns: Object
     * */
    async updateProfile() {
        let result;
        try {
            result = await db(tableName).update({
                firstName: this.firstName,
                lastName: this.lastName,
                email: this.email,
                password: this.password,
                nric: this.nric,
                DOB: this.DOB,
                gender: this.gender,
                profilePic: this.profilePic
            }).where('userId', this.userId);
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result;
    }
    async getProfile() {
        let result;
        try {
            result = await db(tableName).select('*')
                .where('userId', this.userId);
            result = _.map(result, (user) => {
                user.DOB = moment(user.DOB).format('YYYY-MM-DD');
                return user;
            });
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result[0];
    }

}

module.exports = Profile;