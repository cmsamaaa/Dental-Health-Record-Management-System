const _ = require('lodash');
const moment = require('moment');
const db = require('./db');
const tableName = 'bills';

class Bill {
    billId;
    billSubtotal;
    billTax;
    billTotal;
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
                billSubtotal: this.billSubtotal,
                billTax: this.billTax,
                billTotal: this.billTotal,
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
     * Retrieves all `bill` inner join `patient` and `user` record by clinicId
     * Returns: JSON Object
     * */
    async getClinicBills(clinicId) {
        let result;
        try {
            result = await db(tableName).select('*')
                .innerJoin('appointments', tableName + '.apptId', 'appointments.apptId')
                .innerJoin('patients', 'appointments.patientId', 'patients.patientId')
                .innerJoin('users', 'patients.userId', 'users.userId')
                .where('clinicId', clinicId);

            result = _.map(result, (bill) => {
                bill.billDateTime = moment(bill.billDateTime).format('DD/MM/YYYY HH:mm:ss');
                bill = _.omit(bill, 'password');
                return bill;
            });
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result;
    }

    /**
     * Retrieves all `bill` inner join `patient` and `user` record by userId
     * Returns: JSON Object
     * */
    async getUserBills(userId) {
        let result;
        try {
            result = await db(tableName).select('*')
                .innerJoin('appointments', tableName + '.apptId', 'appointments.apptId')
                .innerJoin('clinics', 'appointments.clinicId', 'clinics.clinicId')
                .innerJoin('patients', 'appointments.patientId', 'patients.patientId')
                .innerJoin('users', 'patients.userId', 'users.userId')
                .where('users.userId', userId);

            result = _.map(result, (bill) => {
                bill.billDateTime = moment(bill.billDateTime).format('DD/MM/YYYY HH:mm:ss');
                bill = _.omit(bill, 'password');
                return bill;
            });
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result;
    }

    /**
     * Retrieves one `bill` inner join `patient` and `user` record by billId
     * Returns: JSON Object
     * */
    async getBill() {
        let result;
        try {
            result = await db(tableName).select('*')
                .innerJoin('appointments', tableName + '.apptId', 'appointments.apptId')
                .innerJoin('clinics', 'appointments.clinicId', 'clinics.clinicId')
                .innerJoin('patients', 'appointments.patientId', 'patients.patientId')
                .innerJoin('users', 'patients.userId', 'users.userId')
                .where('billId', this.billId);

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

    /**
     * Retrieves one `bill` inner join `patient` and `user` record by apptId
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