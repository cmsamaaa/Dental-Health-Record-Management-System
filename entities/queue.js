const db = require('./db');
const tableName = 'queue';

class Queue {
    queueId;
    queueNo;
    queueStatus; // Waiting, Treatment, Payment, Completed
    queueDate;
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
            result = await db(tableName).insert({
                queueNo: this.queueNo,
                queueDate: this.queueDate,
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
}

module.exports = Queue;