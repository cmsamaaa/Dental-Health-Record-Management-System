const _ = require('lodash');
const moment = require('moment');
const db = require('./db');
const tableName = 'bills';

class Bill {
    billId;
    billAmount;
    billStatus;
    paymentMethod;
    billDateTime;
    paymentDateTime;
    apptId;

    constructor(data) {
        Object.assign(this, data);
    }

    /**
     * Creates a `bill` record.
     * Can be used during end appointment session.
     * Returns: Object
     * */
    async createBill() {
        let result;
        try {
            result = await db(tableName).insert({
                billAmount: this.billAmount,
                billDateTime: new Date(),
                apptId: this.apptId
            });
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result;
    }
}

module.exports = Bill;