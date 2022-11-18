const db = require('./db');
const tableName = 'profiles';

async function createProfile(profile) {
    let result;
    try {
        result = await db(tableName).insert(profile);
    }
    catch (e) {
        result = {};
    }
    return result;
}

async function getProfile(code) {
    let result;
    try {
        result = db(tableName).select('*').where('code', code);
    }
    catch (e) {
        result = {};
    }
    return result;
}

async function listAllProfilesForLogin() {
    let result;
    try {
        result = db(tableName).select('code').select('nric');
    }
    catch (e) {
        result = {};
    }
    return result;
}

async function dropTable() {
    let result;
    try {
        result = db.schema.dropTable(tableName);
    }
    catch (e) {
        result = {};
    }
    return result;
}

async function createTableIfNotExist() {
    const exists = await db.schema.hasTable(tableName);
    if (!exists) {
        await db.schema.createTable(tableName, (table) => {
            table.increments('id').primary().notNullable();
            table.text('code').notNullable().unique();
            table.text('fullName').notNullable();
            table.text('sex').notNullable();
            table.text('race').notNullable();
            table.text('email').notNullable();
            table.text('nric').notNullable();
            table.text('entityName');
            table.text('UEN');
        });

        await createProfile({
            code: 'SG12345678Z',
            fullName: 'John Doe',
            sex: 'Male',
            race: 'Chinese',
            email: 'john_doe@gmail.com',
            nric: 'S9025123Z'
        });

        await createProfile({
            code: 'SG11111111A',
            fullName: 'Jane Doe',
            sex: 'Female',
            race: 'Chinese',
            email: 'jane_doe@gmail.com',
            nric: 'S8812321A',
            entityName: 'Arrow Goldsmith',
            UEN: '53234923K'
        });
    }
}

module.exports = {
    createProfile,
    getProfile,
    listAllProfilesForLogin,
    dropTable,
    createTableIfNotExist
}