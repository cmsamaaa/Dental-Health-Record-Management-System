const db = require('./db');
const tableName = 'inventories';
const _ = require('lodash');
const moment = require('moment');


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
    clinicId;
    isDeactivated;

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
                note: this.note,
                clinicId: this.clinicId ? this.clinicId : null
            });
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result;
    }

    /**
     * Retrieves all `inventories` records
     * Returns: JSON[]
     * */
    async getAllInventories() {
        let result;
        try {
            result = await db(tableName).select('*')
                    .where('clinicId', this.clinicId);

            result = _.map(result, (inventory) => {
                inventory.expiryDate = moment(inventory.expiryDate).format('DD-MM-YYYY');
                inventory.inboundDate = moment(inventory.inboundDate).format('DD-MM-YYYY');
                return inventory;
            });

        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result;
    }

    /**
     * Retrieves one `inventories` record
     * Returns: JSON Object
     * */
    async getInventory() {
        let result;
        try {
            result = await db(tableName).select('*')
                .where('inventoryId', this.inventoryId);

            result = _.map(result, (inventory) => {
                inventory.expiryDate = moment(inventory.expiryDate).format('YYYY-MM-DD');
                inventory.inboundDate = moment(inventory.inboundDate).format('YYYY-MM-DD');
                return inventory;
            });
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result[0];
    }
    
    /**
     * Update a `inventory` record.
     * Can be used to update inventory.
     * Returns: Object
     * */
    async updateInventory() {
        let result;
        try {
            result = await db(tableName).update({
                name: this.itemName,
                quantity: this.quantity,
                costPerUnit: this.cost,
                expiryDate: this.expiry,
                inboundDate: this.inbound,
                SKU: this.SKU,
                UPC: this.UPC,
                note: this.note
            }).where('inventoryId', this.inventoryId);
        }
        catch (e) {
            console.error(e);
            result = {};
        }
        return result;
    }

    async suspendInventory() {
        let result;
        try {
            result = await db(tableName).update({
                isDeactivated: 1
            }).where('inventoryId', this.inventoryId);
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result;
    }

    async reactivateInventory() {
        let result;
        try {
            result = await db(tableName).update({
                isDeactivated: 0
            }).where('inventoryId', this.inventoryId);
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result;
    }
}

module.exports = Inventory;