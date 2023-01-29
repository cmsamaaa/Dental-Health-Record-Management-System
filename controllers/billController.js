const _ = require('lodash');
const moment = require('moment');
const parse_uri = require('../lib/parse_uri');
const HTTP_STATUS = require('../constants/http_status');
const Appointment = require('../entities/appointment');
const Bill = require('../entities/bill');
const Treatment = require('../entities/treatment');
const Queue = require('../entities/queue');

exports.updatePayment = async (req, res, next) => {
    const user = req.url.split('/')[1];
    const status = 'Completed';

    const bill = new Bill({
        billId: req.body.billId,
        billStatus: 'Paid',
        paymentMethod: req.body.paymentMethod
    });
    const billResult = await bill.updatePayment();

    if (billResult) {
        // Update appointment status to 'Completed'
        const appointment = new Appointment({
            apptId: req.body.apptId,
            status: status
        });
        const appointmentResult = await appointment.updateAppointmentStatus();

        if (appointmentResult) {
            // Update queue status to 'Completed'
            const queue = new Queue({
                apptId: req.body.apptId,
                queueStatus: status
            });
            const queueResult = await queue.closeQueue();

            if (queueResult)
                res.redirect(parse_uri.parse(req, '/' + user + '/bill/invoice?billId=' + req.body.billId));
            else
                res.redirect(parse_uri.parse(req, '/' + user + '/bill/invoice?billId=' + req.body.billId + '&error=queue'));
        }
        else
            res.redirect(parse_uri.parse(req, '/' + user + '/bill/invoice?billId=' + req.body.billId + '&error=appointment'));
    }
    else
        res.redirect(parse_uri.parse(req, '/' + user + '/bill/invoice?billId=' + req.body.billId + '&error=bill'));
};

exports.viewBills = async (req, res, next) => {
    const user = req.url.split('/')[1];

    const title = 'Bills';
    const path = '/' + user + '/bill/view-all';
    let billData = [];

    if (user === 'admin') {
        const bill = new Bill();
        billData = await bill.getClinicBills(req.session.userInfo.clinicId);
    }
    else if (user === 'patient') {
        const bill = new Bill();
        billData = await bill.getUserBills(req.session.userInfo.userId);
    }
    else {
        res.status(HTTP_STATUS.OK).render('404', {
            pageTitle: title,
            path: path,
            query: req.query
        });
    }

    res.status(HTTP_STATUS.OK).render('table/bills', {
        pageTitle: title,
        path: path,
        query: req.query,
        billData: billData
    });
};

exports.viewInvoice = async (req, res, next) => {
    const user = req.url.split('/')[1];
    const pathname = req.originalUrl.split('?')[0].split('/')[3];

    const title = 'Invoice';
    const path = '/' + user + '/bill/' + pathname;

    let billData = {};
    let treatmentData = [];

    if (req.query.billId) {
        const bill = new Bill({ billId: req.query.billId });
        billData = await bill.getBill();

        const treatment = new Treatment({ apptId: billData.apptId });
        treatmentData = await treatment.getAllTreatments();
    }
    else if (req.query.apptId) {
        const bill = new Bill({ apptId: req.query.apptId });
        billData = await bill.getBillByApptId();

        const treatment = new Treatment({ apptId: req.query.apptId });
        treatmentData = await treatment.getAllTreatments();
    }
    else {
        res.status(HTTP_STATUS.OK).render('404', {
            pageTitle: title,
            path: path,
            query: req.query
        });
    }

    billData.dueDate = moment(billData.billDateTime).add(1, 'd').format('DD/MM/YYYY');
    billData.billDateTime = moment(billData.billDateTime).format('DD/MM/YYYY HH:mm:ss');
    billData.paymentDateTime = billData.paymentDateTime ? moment(billData.paymentDateTime).format('DD/MM/YYYY HH:mm:ss') : null;

    res.status(HTTP_STATUS.OK).render('bill/' + pathname, {
        pageTitle: title,
        path: path,
        query: req.query,
        billData: billData,
        invoiceNum: billData.billId < 1000000 ? String(billData.billId).padStart(6, '0') : billData.billId,
        treatmentData: treatmentData
    });
};