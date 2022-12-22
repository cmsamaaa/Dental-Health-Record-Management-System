const moment = require('moment');

const apptId = 1;
const patientId = 1;
const staffId = 2;

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
        staffId: staffId
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