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
     * Retrieves sum of `treatment` prices
     * Returns: JSON
     * */
    async getSumTreatmentPrice() {
        let result;
        try {
            result = await db(tableName).select('apptId')
                .sum('treatmentPrice', { as: 'totalPrice' })
                .where('apptId', this.apptId);
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result[0];
    }

    /**
     * Check if any `treatment` records are not completed yet
     * Returns: Boolean
     * */
    async checkInProgressTreatments() {
        let result;
        try {
            result = await db(tableName).select('*').
                where('apptId', this.apptId)
                .whereNull('treatmentEnd');
        }
        catch (e) {
            console.error(e);
            result = [];
        }

        return result.length > 0;
    }

    /**
     * Update a `treatment` record.
     * Can be used to update treatment record.
     * Returns: 0 or 1
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
     * Reset all `treatment` record medicare status.
     * Can be used to update treatment medicare status.
     * Returns: Object
     * */
    async resetMedicare() {
        let result;
        try {
            result = await db(tableName).update({
                medicareClaim: 0,
                medicareService: null
            }).where('apptId', this.apptId);
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result;
    }

    /**
     * Update a `treatment` record with medicareClaim and medicareService.
     * Can be used to update treatment medicare status.
     * Returns: Object
     * */
    async updateMedicare() {
        let result;
        try {
            result = await db(tableName).update({
                medicareClaim: this.medicareClaim,
                medicareService: this.medicareService
            }).where('treatmentId', this.treatmentId);
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result;
    }

    /**
     * Update a `treatment` record treatmentEnd.
     * Can be used to end treatment.
     * Returns: 0 or 1
     * */
    async completeTreatment() {
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

    /**
     * Delete a `treatment` record.
     * Can be used to delete treatment from database.
     * Returns: 0 or 1
     * */
    async deleteTreatment() {
        let result;
        try {
            result = await db(tableName).where('treatmentId', this.treatmentId).del();
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result;
    }
}

module.exports = Treatment;