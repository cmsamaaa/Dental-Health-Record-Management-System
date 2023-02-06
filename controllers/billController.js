const _ = require('lodash');
const moment = require('moment');
const fs = require('fs').promises;
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

exports.updateMedicare = async (req, res, next) => {
    const updateMedicareFn = async (req, res, next) => {
        const treatment = new Treatment({
            apptId: req.body.apptId
        });
        const result = await treatment.resetMedicare();

        const medicareClaim = req.body.medicareClaim;
        if (medicareClaim) {
            if (medicareClaim.constructor === Array) {
                for (let i = 0; i < medicareClaim.length; i++) {
                    const treatment = new Treatment({
                        treatmentId: medicareClaim[i],
                        medicareClaim: 1,
                        medicareService: req.body.medicareService
                    });

                    const result = await treatment.updateMedicare();
                }
            }
            else {
                const treatment = new Treatment({
                    treatmentId: medicareClaim,
                    medicareClaim: 1,
                    medicareService: req.body.medicareService
                });

                const result = await treatment.updateMedicare();
            }
        }
    };

    if (req.body.medicareClaim) {
        if (req.body.medicareService) {
            if (!_.isEmpty(req.file)) {
                if (req.file.mimetype === 'application/pdf') {
                    const bill = new Bill({
                        billId: req.body.billId,
                        medicareFile: req.file.buffer.toString('base64')
                    });
                    const uploadResult = await bill.uploadMedicareFile();

                    if (uploadResult) {
                        await updateMedicareFn(req, res, next);
                        res.redirect(parse_uri.parse(req, '/admin/bill/invoice?billId=' + req.body.billId));
                    }
                    else
                        res.redirect(parse_uri.parse(req, '/admin/bill/medicare?billId=' + req.body.billId + '&apptId=' + req.body.apptId + '&error=file-type'));
                }
                else
                    res.redirect(parse_uri.parse(req, '/admin/bill/medicare?billId=' + req.body.billId + '&apptId=' + req.body.apptId + '&error=file-type'));
            }
            else
                res.redirect(parse_uri.parse(req, '/admin/bill/medicare?billId=' + req.body.billId + '&apptId=' + req.body.apptId + '&error=no-file'));
        }
        else
            res.redirect(parse_uri.parse(req, '/admin/bill/medicare?billId=' + req.body.billId + '&apptId=' + req.body.apptId + '&error=select-medicare'));
    }
    else {
        const bill = new Bill({ billId: req.body.billId });
        await bill.removeMedicareFile();
        await updateMedicareFn(req, res, next);
        res.redirect(parse_uri.parse(req, '/admin/bill/invoice?billId=' + req.body.billId));
    }
};

exports.downloadMedicareFile = async (req, res, next) => {
    const bill = new Bill({ billId: req.body.billId });
    const billResult = await bill.getBill();

    if (billResult) {
        const fileData = billResult.medicareFile;
        const fileName = billResult.billId + '_' + billResult.nric + '_MedicareClaimForm' + '.pdf';
        const fileType = 'application/pdf';

        res.writeHead(200, {
            'Content-Disposition': `attachment; filename="${fileName}"`,
            'Content-Type': fileType,
        });

        const download = Buffer.from(fileData, 'base64');
        res.end(download);
    }
    else
        res.redirect(parse_uri.parse(req, '/admin/bill/invoice?billId=' + req.body.billId + '&error=download'));
};

exports.viewBills = async (req, res, next) => {
    const user = req.url.split('/')[1];
    const filter = req.query.filter;

    const title = 'Bills';
    const path = '/' + user + '/bill/view-all';
    let billData = [];

    if (user === 'admin') {
        const bill = new Bill({ billStatus: filter });

        if (filter === 'all')
            billData = await bill.getClinicBills(req.session.userInfo.clinicId);
        else if (filter === 'unpaid')
            billData = await bill.getClinicBillsByStatus(req.session.userInfo.clinicId);
        else if (filter === 'paid')
            billData = await bill.getClinicBills(req.session.userInfo.clinicId);
        else
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

    billData.medicareDeduction = 0;
    for (let i = 0; i < treatmentData.length; i++) {
        if (treatmentData[i].medicareClaim)
            billData.medicareDeduction += Number(treatmentData[i].treatmentPrice);
    }

    billData.billTotal -= billData.medicareDeduction * 1.08;

    billData.medicareDeduction = billData.medicareDeduction.toFixed(2);
    billData.medicareDeductionTax = (billData.medicareDeduction * 0.08).toFixed(2);
    billData.billTotal = billData.billTotal.toFixed(2);

    res.status(HTTP_STATUS.OK).render('bill/' + pathname, {
        pageTitle: title,
        path: path,
        query: req.query,
        billData: billData,
        invoiceNum: billData.billId < 1000000 ? String(billData.billId).padStart(6, '0') : billData.billId,
        treatmentData: treatmentData
    });
};

exports.viewMedicare = async (req, res, next) => {
    const user = req.url.split('/')[1];

    const title = 'Medicare';
    const path = '/' + user + '/bill/medicare';

    if (req.query.billId) {
        const treatment = new Treatment({ apptId: req.query.apptId });
        const treatmentData = await treatment.getAllTreatments();

        let medicareService = null;
        for (let i = 0; i < treatmentData.length; i++) {
            if (treatmentData[i].medicareService)
                medicareService = treatmentData[i].medicareService;
        }

        res.status(HTTP_STATUS.OK).render('form/medicare', {
            pageTitle: title,
            path: path,
            query: req.query,
            treatmentData: treatmentData,
            medicareService: medicareService
        });
    }
    else {
        res.status(HTTP_STATUS.OK).render('404', {
            pageTitle: title,
            path: path,
            query: req.query
        });
    }
};