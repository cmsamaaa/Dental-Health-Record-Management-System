const db = require('./db');
const tableName = 'reviews';
const _ = require('lodash');

class Review {
    reviewId;
    reviewScore;
    reviewDescription;
    reviewTitle;
    clinicId;
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
                    .innerJoin('patients', 'patients.patientId', 'reviews.patientId')
                    .innerJoin('users', 'users.userId', 'patients.userId')
                    .where('clinicId', this.clinicId);
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result;
    }

    async getClinic() {
        let result;
        try {
            result = await db(tableName).select('*')
                .where('clinicId', this.clinicId);
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result[0];
    }

    async get() {
        let result;
        try {
            result = await db(tableName).select('*')
                .where('reviewId', this.reviewId);
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
                .where('patientId', this.patientId)
                .andWhere('clinicId', this.clinicId);
                
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result;
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