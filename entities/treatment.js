const _ = require('lodash');
const moment = require('moment');
const db = require('./db');
const tableName = 'treatments';

class Treatment {
    treatmentId;
    treatmentName;
    treatmentPrice;
    treatmentTeeth;
    treatmentStart;
    treatmentEnd;
    medicareClaim;
    medicareService;
    staffId;
    apptId;

    constructor(data) {
        Object.assign(this, data);
    }

    /**
     * Inserts a `treatment` record.
     * Can be used for create treatment record.
     * Returns: Object
     * */
    async createTreatment() {
        let result;
        try {
            result = await db(tableName).insert({
                treatmentName: this.treatmentName,
                treatmentPrice: this.treatmentPrice,
                treatmentTeeth: this.treatmentTeeth,
                treatmentStart: new Date(),
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
     * Retrieves all `treatment` records under an appointment
     * Returns: JSON[]
     * */
    async getAllTreatments() {
        let result;
        try {
            result = await db(tableName).select('*').where('apptId', this.apptId);

            if (!_.isEmpty(result)) {
                result = _.map(result, (treatment) => {
                    treatment.treatmentStart = moment(treatment.treatmentStart).format('YYYY-MM-DD HH:mm:ss');
                    treatment.treatmentEnd = moment(treatment.treatmentEnd).format('YYYY-MM-DD HH:mm:ss');
                    return treatment;
                });
            }
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result;
    }

    /**
     * Update a `treatment` record.
     * Can be used to update treatment record.
     * Returns: Object
     * */
    async updateTreatment() {
        let result;
        try {
            result = await db(tableName).update({
                treatmentName: this.treatmentName,
                treatmentPrice: this.treatmentPrice,
                treatmentTeeth: this.treatmentTeeth
            }).where('treatmentId', this.treatmentId);
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result;
    }

    /**
     * End a `treatment` record.
     * Can be used to update treatmentEnd.
     * Returns: Object
     * */
    async endTreatment() {
        let result;
        try {
            result = await db(tableName).update({
                treatmentEnd: new Date()
            }).where('treatmentId', this.treatmentId);
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result;
    }
}

module.exports = Treatment;