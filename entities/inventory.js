const db = require('./db');
const tableName = 'inventories';
const _ = require('lodash');

class Inventory {
    inventoryId;
    name;
    quantity;
    costPerUnit;
    expiryDate;
    inboundDate;
    SKU;
    UPC;
    note;

    constructor(data) {
        Object.assign(this, data);
    }

    /**
     * Inserts a `inventory` record.
     * Can be used for create inventory.
     * Returns: Object
     * */
    async createInventory() {
        let result;
        try {
            result = await db(tableName).insert({
                inventoryId: this.inventoryId,
                name: this.name,
                quantity: this.quantity,
                costPerUnit: this.costPerUnit,
                expiryDate: this.expiryDate,
                inboundDate: this.inboundDate,
                SKU: this.SKU,
                UPC: this.UPC,
                note: this.note
            });
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result;
    }

    /**
     * Retrieves all `appointment` inner join `patient` and `user` records
     * Returns: JSON[]
     * */
    async getAllInventories() {
        let result;
        try {
            result = await db(tableName).select('*')
                //.innerJoin('inventories', 'inventories.patientId', 'patients.patientId')
                //.innerJoin('clinics', 'appointments.clinicId', 'clinics.clinicId');
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result;
    }

    /**
     * Retrieves all `appointment` inner join `patient` and `user` records by `userId`
     * Returns: JSON[]
     * */
    async getAllUserAppointments() {
        let result;
        try {
            result = await db(tableName).select('*')
                .innerJoin('patients', 'appointments.patientId', 'patients.patientId')
                .innerJoin('clinics', 'appointments.clinicId', 'clinics.clinicId')
                .where('patients.userId', this.userId);

            result = _.map(result, (patient) => {
                return _.omit(patient, 'password');
            });
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result;
    }

    /**
     * Retrieves one `appointment` inner join `patient` and `user` record
     * Returns: JSON Object
     * */
    async getInventory() {
        let result;
        try {
            result = await db(tableName).select('*')
                //.innerJoin('inventories', 'inventories.inventoryId')
                //.innerJoin('users', 'patients.userId', 'users.userId')
                .where('inventoryId', this.inventoryId);
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result[0];
    }

    /**
     * Update a `appointment` record.
     * Can be used to update appointment.
     * Returns: Object
     * */
    async updateAppointment() {
        let result;
        try {
            result = await db(tableName).update({
                startDateTime: dateTimeFormat.parse(this.startDateTime),
                endDateTime: dateTimeFormat.parseWithAddition(this.startDateTime, 1, 30)
            }).where('apptId', this.apptId);
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result;
    }

    /**
     * Update a `appointment` record status to 'Cancelled'.
     * Can be used to suspend appointment.
     * Returns: Object
     * */
    async suspendAppointment() {
        let result;
        try {
            result = await db(tableName).update({
                status: 'Cancelled'
            }).where('apptId', this.apptId);
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result;
    }

    /**
     * Delete a `appointment` record.
     * Can be used to clear record after unit testing.
     * Returns: Object
     * */
    async deleteAppointment() {
        let result;
        try {
            result = await db(tableName).del()
                .where({
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

module.exports = Inventory;