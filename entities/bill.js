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

    /**
     * Retrieves one `bill` inner join `patient` and `user` record
     * Returns: JSON Object
     * */
    async getBillByApptId() {
        let result;
        try {
            result = await db(tableName).select('*')
                .innerJoin('appointments', tableName + '.apptId', 'appointments.apptId')
                .innerJoin('clinics', 'appointments.clinicId', 'clinics.clinicId')
                .innerJoin('patients', 'appointments.patientId', 'patients.patientId')
                .innerJoin('users', 'patients.userId', 'users.userId')
                .where(tableName + '.apptId', this.apptId);

            result = _.map(result, (bill) => {
                bill = _.omit(bill, 'password');
                return bill;
            });
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result[0];
    }
}

module.exports = Bill;