const db = require('./db');
const tableName = 'queues';

const _ = require('lodash');
const moment = require('moment');

class Queue {
    queueId;
    queueNo;
    queueStatus; // Waiting, In Session, Payment, Completed, Skipped, Missed, Cancelled
    queueDateTime;
    clinicId;
    patientId;
    apptId;

    constructor(data) {
        Object.assign(this, data);
    }

    /**
     * Inserts a `queue` record.
     * Can be used to create a queue record.
     * Returns: Object
     * */
    async add() {
        let result;
        try {
            const temp = await db(tableName)
                .where('queueDateTime', '>=', moment(new Date()).format('YYYY-MM-DD 00:00:00'))
                .andWhere('clinicId', this.clinicId)
                .max('queueNo', { as: 'queueNo' })
                .first();

            result = await db(tableName).insert({
                queueId: this.queueId ? this.queueId : null,
                queueNo: temp.queueNo !== null ? temp.queueNo + 1 : 1,
                queueDateTime: new Date(),
                clinicId: this.clinicId,
                patientId: this.patientId,
                apptId: this.apptId ? this.apptId : null
            });
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result;
    }

    /**
     * Retrieves existing patient `queue` info
     * Returns: Object
     * */
    async getPatientQueueInformation() {
        let result;
        try {
            result = await db(tableName).select('*')
                .where('queueId', this.queueId)
                .innerJoin('patients', 'patients.patientId', 'queues.patientId')
                .innerJoin('users', 'users.userId', 'patients.userId')
                .first();
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result;
    }

    /**
     * Retrieves existing patient `queue` by patientId
     * Returns: Object
     * */
    async getPatientQueue() {
        let result;
        try {
            result = await db(tableName).select('*')
                .where('queueDateTime', '>=', moment(new Date()).format('YYYY-MM-DD 00:00:00'))
                .andWhere('patientId', this.patientId)
                .andWhere('queueStatus', 'Waiting')
                .count('queueNo', { as: 'inQueue' })
                .first();
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result;
    }

    /**
     * Retrieves all `queue` of a specific clinic
     * Returns: Object
     * */
    async getClinicQueue() {
        let result;
        try {
            result = await db(tableName).select('*')
                .where('queueDateTime', '>=', moment(new Date()).format('YYYY-MM-DD 00:00:00'))
                .andWhere('queues.clinicId', this.clinicId)
                .andWhere((builder) => builder.whereIn('queueStatus', ['Waiting', 'Skipped', 'Payment']))
                .innerJoin('clinics', 'queues.clinicId', 'clinics.clinicId')
                .innerJoin('patients', 'queues.patientId', 'patients.patientId')
                .innerJoin('users', 'patients.userId', 'users.userId')
                .leftJoin('appointments', 'queues.apptId', 'appointments.apptId');

            result = _.map(result, (queue) => {
                queue.queueDateTime = moment(queue.queueDateTime).format('YYYY-MM-DD HH:mm:ss');
                queue.startDateTime = moment(queue.startDateTime).format('YYYY-MM-DD HH:mm:ss');
                queue.endDateTime = moment(queue.endDateTime).format('YYYY-MM-DD HH:mm:ss');
                return queue;
            });
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result;
    }

    /**
     * Retrieves all `queue` with appointments for dentists
     * Returns: Object
     * */
    async getDentistQueue() {
        let result;
        try {
            result = await db(tableName).select('*')
                .where('queueDateTime', '>=', moment(new Date()).format('YYYY-MM-DD 00:00:00'))
                .andWhere(tableName + '.clinicId', this.clinicId)
                .andWhere((builder) => builder.whereIn('queueStatus', ['Waiting', 'Skipped']))
                .innerJoin('appointments', 'queues.apptId', 'appointments.apptId')
                .innerJoin('staffs', 'appointments.staffId', 'staffs.staffId')
                .innerJoin('users', 'staffs.userId', 'users.userId');

            result = _.map(result, (queue) => {
                queue.queueDateTime = moment(queue.queueDateTime).format('YYYY-MM-DD HH:mm:ss');
                queue.startDateTime = moment(queue.startDateTime).format('YYYY-MM-DD HH:mm:ss');
                queue.endDateTime = moment(queue.endDateTime).format('YYYY-MM-DD HH:mm:ss');
                return queue;
            });
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result;
    }

    /**
     * Retrieves current count of `queue` where queueDate = today & queueStatus = Waiting
     * Returns: Integer
     * */
    // async getQueueCount() {
    //     let result;
    //     try {
    //         result = await db(tableName).distinct('clinicId')
    //             .where('queueDateTime', '>=', moment(new Date()).format('YYYY-MM-DD 00:00:00'))
    //             .andWhere('clinicId', this.clinicId)
    //             .count('queueNo', { as: 'inQueue' })
    //             .first();
    //     }
    //     catch (e) {
    //         console.error(e);
    //         result = {};
    //     }

    //     return result.inQueue;
    // }

    /**
     * Update a `queue` apptId.
     * Used by administrators to link appt with queue no.
     * Returns: Object
     * */
    async linkQueueWithApptId() {
        let result;
        try {
            result = await db(tableName).update({
                apptId: this.apptId
            }).where('queueId', this.queueId);
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result;
    }

    /**
     * Update a `queue` record status.
     * Can be used to change status of queue.
     * Returns: Object
     * */
    async updateQueueStatus() {
        let result;
        try {
            result = await db(tableName).update({
                queueStatus: this.queueStatus
            }).where('queueId', this.queueId);
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result;
    }

    /**
     * Update all `queue` record status to `Missed` where endDateTime < today & status is `Upcoming`.
     * Can be used to update queue status.
     * Returns: Object
     * */
    async updateAllMissedQueue() {
        let result;
        try {
            result = await db(tableName).update({
                queueStatus: 'Missed'
            }).where('queueDateTime', '<', moment(new Date()).format('YYYY-MM-DD 00:00:00'))
                .andWhere((builder) => builder.whereIn('queueStatus', ['Waiting', 'Skipped']));
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result;
    }

    /**
     * Update a `queue` record status to 'Waiting' or 'Payment'.
     * Can be used to undo a skipped queue.
     * Returns: Object
     * */
    async callQueue() {
        let result;
        try {
            result = await db(tableName).update({
                queueStatus: this.queueStatus
            }).where('queueId', this.queueId);
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result;
    }

    /**
     * Update a `queue` record status to 'Skipped'.
     * Can be used to skip queue.
     * Returns: Object
     * */
    async skipQueue() {
        let result;
        try {
            result = await db(tableName).update({
                queueStatus: 'Skipped'
            }).where('queueId', this.queueId);
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result;
    }

    /**
     * Update a `queue` record status to 'Cancelled'.
     * Can be used to cancel queue.
     * Returns: Object
     * */
    async suspendQueue() {
        let result;
        try {
            result = await db(tableName).update({
                queueStatus: 'Cancelled'
            }).where('clinicId', this.clinicId)
                .andWhere('patientId', this.patientId)
                .andWhere('queueDateTime', '>=', moment(new Date()).format('YYYY-MM-DD 00:00:00'))
                .andWhere('queueStatus', 'Waiting');
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result;
    }

    /**
     * Update a `queue` record status to 'Cancelled' by queueId.
     * Can be used to cancel queue for admins.
     * Returns: Object
     * */
    async suspendQueueById() {
        let result;
        try {
            result = await db(tableName).update({
                queueStatus: 'Cancelled'
            }).where('queueId', this.queueId);
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result;
    }

    /**
     * Update a `queue` record in-session by apptId and queueStatus.
     * Can be used to change status of queue.
     * Returns: Object
     * */
    async endInSessionQueue() {
        let result;
        try {
            result = await db(tableName).update({
                queueStatus: this.queueStatus
            })
                .where('apptId', this.apptId)
                .andWhere('queueStatus', 'In Session');
        }
        catch (e) {
            console.error(e);
            result = 0;
        }

        return result;
    }

    /**
     * Delete a `queue` record.
     * Can be used to clear record after unit testing.
     * Returns: Object
     * */
    async deleteQueue() {
        let result;
        try {
            result = await db(tableName).del()
                .where({
                    queueId: this.queueId
                });
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result;
    }
}

module.exports = Queue;