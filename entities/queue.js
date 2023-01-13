const db = require('./db');
const tableName = 'queue';

const moment = require('moment');

class Queue {
    queueId;
    queueNo;
    queueStatus; // Waiting, Treatment, Payment, Completed, Missed, Cancelled
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
     * Retrieves existing patient `queue`
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