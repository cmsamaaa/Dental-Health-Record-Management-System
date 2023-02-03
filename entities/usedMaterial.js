const _ = require('lodash');
const moment = require('moment');
const db = require('./db');
const tableName = 'used_materials';

class UsedMaterial {
    materialId;
    materialQty;
    inventoryId;
    treatmentId;
    apptId;

    constructor(data) {
        Object.assign(this, data);
    }

    /**
     * Creates a `used_materials` record.
     * Can be used during appointment session.
     * Returns: Object
     * */
    async addUsedMaterial() {
        let result;
        try {
            result = await db(tableName).insert({
                materialQty: this.materialQty,
                inventoryId: this.inventoryId,
                treatmentId: this.treatmentId,
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
     * Retrieves all `used_materials` by apptId
     * Returns: JSON Object
     * */
    async getUsedMaterials() {
        let result;
        try {
            result = await db(tableName).select('*')
                .innerJoin('treatments', tableName + '.treatmentId', 'treatments.treatmentId')
                .innerJoin('inventories', tableName + '.inventoryId', 'inventories.inventoryId')
                .where(tableName + '.apptId', this.apptId);
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result;
    }

    /**
     * Retrieves all `used_materials` by clinicId
     * Returns: JSON Object
     * */
    async getUsedMaterialsByClinicId(clinicId) {
        let result;
        try {
            result = await db(tableName).select('*')
                .innerJoin('treatments', tableName + '.treatmentId', 'treatments.treatmentId')
                .innerJoin('inventories', tableName + '.inventoryId', 'inventories.inventoryId')
                .innerJoin('appointments', tableName + '.apptId', 'appointments.apptId')
                .where('appointments.clinicId', clinicId);

            result = _.map(result, (usedMaterial) => {
                usedMaterial.treatmentStart = moment(usedMaterial.treatmentStart).format('DD/MM/YYYY HH:mm');
                usedMaterial.treatmentEnd = moment(usedMaterial.treatmentEnd).format('DD/MM/YYYY HH:mm');
                return usedMaterial;
            });
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result;
    }

    /**
     * Delete a `used_materials` record.
     * Can be used to remove a used material record.
     * Returns: Object
     * */
    async deleteUsedMaterial() {
        let result;
        try {
            result = await db(tableName).del()
                .where({
                    materialId: this.materialId
                });
        }
        catch (e) {
            console.error(e);
            result = {};
        }

        return result;
    }
}

module.exports = UsedMaterial;