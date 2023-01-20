const db = require('./db');
const tableName = 'reviews';
const _ = require('lodash');

class Review {
    reviewId;
    reviewScore;
    reviewDescription;
    reviewTitle;
    clinicId;
    staffId;
    patientId 

    constructor(data) {
        Object.assign(this, data);
    }

    /**
     * Inserts a `review` .
     * Can be used for create review.
     * Returns: Object
     * */
    async add() {
        let result;
        try {
            result = await db(tableName).insert({
                reviewScore: this.reviewScore,
                reviewDescription: this.reviewDescription,
                reviewTitle: this.reviewTitle,
                clinicId: this.clinicId,
                staffId: this.staffId,
                patientId: this.patientId
            });
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result;
    }

    /**
     * Retrieves all `reviews`
     * Returns: JSON[]
     * */
    async getAll() {
        let result;
        try {
            result = await db(tableName).select('*')
                    .where('clinicId', this.clinicId);
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result;
    }

    async get() {
        let result;
        try {
            result = await db(tableName).select('*')
                .innerJoin('staffs', 'staffs.clinicId', 'reviews.clinicId')
                .where('clinicId', this.clinicId);
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result[0];
    }

    async getMyReview() {
        let result;
        try {
            result = await db(tableName).select('*')
                //.innerJoin('patients', 'oral_health_records.patientId', 'patients.patientId')
                .where('patientId', this.patientId);
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result;
    }

    async getMyReviews() {
        let result;
        try {
            result = await db(tableName).select('*')
                .where('patientId', this.patientId);
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result[0];
    }
    
    /**
     * Update a `review`.
     * Can be used to update review.
     * Returns: Object
     * */
    async update() {
        let result;
        try {
            result = await db(tableName).update({
                reviewScore: this.reviewScore,
                reviewDescription: this.reviewDescription,
                reviewTitle: this.reviewTitle
            }).where('reviewId', this.reviewId);
        }
        catch (e) {
            console.error(e);
            result = {};
        }
        return result;
    }
}

module.exports = Review;