const tester = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const should = tester.should();

tester.use(chaiHttp);

describe('Run all test units', () => {
    before((done) => {
        // create table and insert seed data
        done();
    });

    after((done) => {
        // drop tale
        done();
    });

    /* Start of unit tests */
    describe('Demo test unit', () => {
        it('Demo test unit', (done) => {
            done();
        });
    });
    /* End of unit tests */
});