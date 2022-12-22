const tester = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const should = tester.should();

const generate_data = require('../lib/generate_data');

const Appointment = require('../entities/appointment');

tester.use(chaiHttp);

describe('Run all test units', () => {
    before((done) => {
        done();
    });

    after((done) => {
        const appointment = new Appointment(generate_data.suspend_appointment());
        appointment.deleteAppointment();
        done();
    });

    /* Start of API endpoint unit tests */

    describe('01 | /GET /api/info/get/all 200 | Get all clinics', () => {
        it('it should return an array of JSON object with HTTP status code 200', (done) => {
            tester.request(app)
                .get('/api/clinic/get/all')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.not.be.null;
                    done();
                });
        });
    });

    describe('02 | /GET /api/clinic/get/:clinicId 200 | Request with Valid ClinicId', () => {
        it('it should return a JSON object with HTTP status code 200', (done) => {
            tester.request(app)
                .get('/api/clinic/get/1')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.not.be.null;
                    res.body.should.not.be.empty;
                    done();
                });
        });
    });

    describe('03 | /GET /api/clinic/get/:clinicId 404 | Request with Invalid ClinicId', () => {
        it('it should return an empty JSON object with HTTP status code 404', (done) => {
            tester.request(app)
                .get('/api/clinic/get/' + Number.MAX_SAFE_INTEGER)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.empty;
                    done();
                });
        });
    });

    describe('04 | /GET /api/clinic/get/dentist/:clinicId 200 | Request with Valid ClinicId', () => {
        it('it should return a JSON object with HTTP status code 200', (done) => {
            tester.request(app)
                .get('/api/clinic/get/dentist/1')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.not.be.null;
                    res.body.should.not.be.empty;
                    done();
                });
        });
    });

    describe('05 | /GET /api/clinic/get/dentist/:clinicId 404 | Request with Invalid ClinicId', () => {
        it('it should return an empty JSON object with HTTP status code 404', (done) => {
            tester.request(app)
                .get('/api/clinic/get/dentist/' + Number.MAX_SAFE_INTEGER)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.empty;
                    done();
                });
        });
    });

    describe('06 | /GET /api/patient/get/all 200 | Get all patient info', () => {
        it('it should return an array of JSON object with HTTP status code 200', (done) => {
            tester.request(app)
                .get('/api/patient/get/all')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.not.be.null;
                    done();
                });
        });
    });

    describe('07 | /GET /api/patient/get/:userId 200 | Request with Valid UserId', () => {
        it('it should return a JSON object with HTTP status code 200', (done) => {
            tester.request(app)
                .get('/api/patient/get/36')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.not.be.null;
                    res.body.should.not.be.empty;
                    done();
                });
        });
    });

    describe('08 | /GET /api/patient/get/:userId 404 | Request with Invalid UserId', () => {
        it('it should return an empty JSON object with HTTP status code 404', (done) => {
            tester.request(app)
                .get('/api/patient/get/' + Number.MAX_SAFE_INTEGER)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.empty;
                    done();
                });
        });
    });

    describe('09 | /GET /api/dentist/get/:staffId 200 | Request with Valid StaffId', () => {
        it('it should return a JSON object with HTTP status code 200', (done) => {
            tester.request(app)
                .get('/api/dentist/get/2')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.not.be.null;
                    res.body.should.not.be.empty;
                    done();
                });
        });
    });

    describe('10 | /GET /api/dentist/get/:staffId 404 | Request with Invalid StaffId', () => {
        it('it should return an empty JSON object with HTTP status code 404', (done) => {
            tester.request(app)
                .get('/api/dentist/get/' + Number.MAX_SAFE_INTEGER)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.empty;
                    done();
                });
        });
    });

    describe('11 | /POST /api/appointment/create 201 | Create Appointment Record', () => {
        it('it should return a json object with `apptId` and 201 status code', (done) => {
            tester.request(app)
                .post('/api/appointment/create')
                .send(generate_data.new_appointment())
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.not.be.empty;
                    res.body.apptId.should.not.be.null;
                    done();
                });
        });
    });

    describe('12 | /POST /api/appointment/create 400 | Create Appointment Record with Empty Body', () => {
        it('it should return an empty json object with 400 status code', (done) => {
            tester.request(app)
                .post('/api/appointment/create')
                .send({})
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.empty;
                    done();
                });
        });
    });

    describe('13 | /GET /api/appointment/get/all 200 | Get all appointment records', () => {
        it('it should return an array of JSON object with HTTP status code 200', (done) => {
            tester.request(app)
                .get('/api/appointment/get/all')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.not.be.null;
                    done();
                });
        });
    });

    describe('14 | /GET /api/appointment/get/all/:userId 200 | Request with Valid UserId', () => {
        it('it should return a JSON object with HTTP status code 200', (done) => {
            tester.request(app)
                .get('/api/appointment/get/all/37')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.not.be.null;
                    res.body.should.not.be.empty;
                    done();
                });
        });
    });

    describe('15 | /GET /api/appointment/get/all/:userId 404 | Request with Invalid UserId', () => {
        it('it should return an empty JSON object with HTTP status code 404', (done) => {
            tester.request(app)
                .get('/api/appointment/get/all/' + Number.MAX_SAFE_INTEGER)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.empty;
                    done();
                });
        });
    });

    describe('16 | /GET /api/appointment/get/:apptId 200 | Request with Valid ApptId', () => {
        it('it should return a JSON object with HTTP status code 200', (done) => {
            tester.request(app)
                .get('/api/appointment/get/1')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.not.be.null;
                    res.body.should.not.be.empty;
                    done();
                });
        });
    });

    describe('17 | /GET /api/appointment/get/:apptId 404 | Request with Invalid ApptId', () => {
        it('it should return an empty JSON object with HTTP status code 404', (done) => {
            tester.request(app)
                .get('/api/appointment/get/' + Number.MAX_SAFE_INTEGER)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.empty;
                    done();
                });
        });
    });

    describe('18 | /POST /api/appointment/edit 200 | Edit Appointment Record', () => {
        it('it should return a json object with id with 200 status code', (done) => {
            tester.request(app)
                .post('/api/appointment/edit')
                .send(generate_data.edit_appointment())
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.not.be.empty;
                    res.body.success.should.not.be.null;
                    done();
                });
        });
    });

    describe('19 | /POST /api/appointment/edit 400 | Edit Appointment Record with Empty Body', () => {
        it('it should return an empty json object with 400 status code', (done) => {
            tester.request(app)
                .post('/api/appointment/edit')
                .send({})
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.empty;
                    done();
                });
        });
    });

    describe('20 | /POST /api/appointment/suspend 200 | Suspend Appointment Record', () => {
        it('it should return a json object with id with 200 status code', (done) => {
            tester.request(app)
                .post('/api/appointment/suspend')
                .send(generate_data.suspend_appointment())
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.not.be.empty;
                    res.body.success.should.not.be.null;
                    done();
                });
        });
    });

    describe('21 | /POST /api/appointment/suspend 400 | Suspend Appointment Record with Empty Body', () => {
        it('it should return an empty json object with 400 status code', (done) => {
            tester.request(app)
                .post('/api/appointment/suspend')
                .send({})
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.empty;
                    done();
                });
        });
    });

    /* End of API endpoint unit tests */
});