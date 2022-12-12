const moment = require('moment');

const apptId = 1;
const patientId = 1;

exports.new_appointment = () => {
    let dateTimeNow = moment().add(7, 'days');
    dateTimeNow.set({
        hour: 14,
        minute: 30,
        second: 0,
        millisecond: 0
    });
    const apptDateTime = dateTimeNow.format('DD/MM/YYYY HH:mm');

    return {
        apptId: apptId,
        apptDateTime: apptDateTime,
        patientId: patientId
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
    const apptDateTime = dateTimeNow.format('DD/MM/YYYY HH:mm');

    return {
        apptId: apptId,
        apptDateTime: apptDateTime
    };
};

exports.suspend_appointment = () => {
    return {
        apptId: apptId
    };
};