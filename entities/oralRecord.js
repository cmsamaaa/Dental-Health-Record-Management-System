const db = require('./db');
const tableName = 'oral_health_records';
const _ = require('lodash');
const moment = require('moment');


class oralRecord {
    recordId;
    recordTeeth;
    recordDescription;
    recordCreatedAt;
    patientId;
    apptId

    constructor(data) {
        Object.assign(this, data);
    }

    /**
     * Inserts a `oral` record.
     * Can be used for create oral record.
     * Returns: Object
     * */
    async add() {
        let result;
        try {
            result = await db(tableName).insert({
                recordId: this.recordId,
                recordTeeth: this.recordTeeth,
                recordDescription: this.recordDescription,
                recordCreatedAt: this.recordCreatedAt,
                patientId: this.patientId ? this.patientId : null,
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
     * Retrieves all `oral` records
     * Returns: JSON[]
     * */
    async getAll() {
        let result;
        try {
            result = await db(tableName).select('*')
                    .where('patientId', this.patientId);

            result = _.map(result, (oralRecords) => {
                oralRecords.recordCreatedAt = moment(oralRecords.recordCreatedAt).format('DD-MM-YYYY');
                return oralRecords;
            });

        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result;
    }

    /**
     * Retrieves one `oral` record
     * Returns: JSON Object
     * */
    async get() {
        let result;
        try {
            result = await db(tableName).select('*')
                .where('recordId', this.recordId);

            result = _.map(result, (oralRecords) => {
                oralRecords.recordCreatedAt = moment(oralRecords.recordCreatedAt).format('DD-MM-YYYY');
                return oralRecords;
            });
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result[0];
    }

    async getMyOralRecord() {
        let result;
        try {
            result = await db(tableName).select('*')
                .where('patientId', this.patientId);

            result = _.map(result, (oralRecords) => {
                oralRecords.recordCreatedAt = moment(oralRecords.recordCreatedAt).format('DD-MM-YYYY');
                return oralRecords;
            });
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result[0];
    }

    async getApptOralRecord() {
        let result;
        try {
            result = await db(tableName).select('*')
                .innerJoin('patients', 'oral_health_records.patientId', 'patients.patientId')
                .where('apptId', this.apptId);

            result = _.map(result, (oralRecords) => {
                oralRecords.recordCreatedAt = moment(oralRecords.recordCreatedAt).format('DD-MM-YYYY');
                return oralRecords;
            });
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result[0];
    }
    
    /**
     * Update a `oral` record.
     * Can be used to update oral record.
     * Returns: Object
     * */
    async update() {
        let result;
        try {
            result = await db(tableName).update({
                recordTeeth: this.recordTeeth,
                recordDescription: this.recordDescription
            }).where('recordId', this.recordId);
        }
        catch (e) {
            console.error(e);
            result = {};
        }
        return result;
    }
}

module.exports = oralRecord;