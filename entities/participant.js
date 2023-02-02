const _ = require('lodash');
const moment = require('moment');
const db = require('./db');
const tableName = 'participants';

class AppointmentParticipants {
    apptId;
    staffId;

    constructor(data) {
        Object.assign(this, data);
    }

    /**
     * Creates a `appointment_participants` record.
     * Can be used during appointment session.
     * Returns: Object
     * */
    async addParticipant() {
        let result;
        try {
            result = await db(tableName).insert({
                apptId: this.apptId,
                staffId: this.staffId
            });
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result;
    }

    /**
     * Retrieves all `participants` inner join `staffs` and `users` record by apptId
     * Returns: JSON Object
     * */
    async getParticipants() {
        let result;
        try {
            result = await db(tableName).select('*')
                .innerJoin('staffs', tableName + '.staffId', 'staffs.staffId')
                .innerJoin('users', 'staffs.userId', 'users.userId')
                .where(tableName + '.apptId', this.apptId);

            result = _.map(result, (participant) => {
                participant = _.omit(participant, 'password');
                return participant;
            });
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result;
    }

    /**
     * Retrieve a `appointment_participants` inner join `staffs` and `users` record by apptId & staffId
     * Returns: JSON Object
     * */
    async getParticipant() {
        let result;
        try {
            result = await db(tableName).select('*')
                .innerJoin('staffs', tableName + '.staffId', 'staffs.staffId')
                .innerJoin('users', 'staffs.userId', 'users.userId')
                .where(tableName + '.apptId', this.apptId)
                .andWhere(tableName + '.staffId', this.staffId)
                .first();
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result;
    }

    /**
     * Delete a `appointment_participants` record.
     * Can be used to remove a participant.
     * Returns: Object
     * */
    async deleteParticipants() {
        let result;
        try {
            result = await db(tableName).del()
                .where({
                    apptId: this.apptId,
                    staffId: this.staffId
                });
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result;
    }
}

module.exports = AppointmentParticipants;