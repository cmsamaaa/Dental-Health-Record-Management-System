const moment = require('moment');

const apptId = 1;
const patientId = 1;
const staffId = 2;
const clinicId = 1;
const queueId = 2;

// Appointment
exports.new_appointment = () => {
    let dateTimeNow = moment().add(7, 'days');
    dateTimeNow.set({
        hour: 14,
        minute: 30,
        second: 0,
        millisecond: 0
    });
    const startDateTime = dateTimeNow.format('DD/MM/YYYY HH:mm');

    return {
        apptId: apptId,
        startDateTime: startDateTime,
        patientId: patientId,
        staffId: staffId,
        clinicId: clinicId
    };
};

exports.edit_appointment = () => {
    let dateTimeNow = moment().add(14, 'days');
    dateTimeNow.set({
        hour: 14,
        minute: 30,
        second: 0,
        millisecond: 0
    });
    const startDateTime = dateTimeNow.format('DD/MM/YYYY HH:mm');

    return {
        apptId: apptId,
        startDateTime: startDateTime
    };
};

exports.suspend_appointment = () => {
    return {
        apptId: apptId
    };
};

// Queue
exports.new_queue = () => {
    return {
        queueId: queueId,
        queueNo: 1,
        clinicId: clinicId,
        patientId: patientId
    };
};