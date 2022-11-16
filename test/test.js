const tester = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const should = tester.should();

tester.use(chaiHttp);

describe('Check frontend paths', () => {
    before((done) => {
        // create table and insert seed data
    });

    after((done) => {
        // drop tale
    });

    /* Start of unit tests */
    describe('Demo test unit', () => {
        it('Demo test unit', (done) => {
            done();
        });
    });
    /* End of unit tests */
});