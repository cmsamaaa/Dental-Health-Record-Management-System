const moment = require('moment');

exports.parse = (dateTime) => {
    const apptDate = dateTime.split(' ')[0].split('/');
    const apptTime = dateTime.split(' ')[1].split(':');
    const appendApptDateTime = apptDate[2] + "-" + apptDate[1] + "-" + apptDate[0] + " " + apptTime[0] + ":" + apptTime[1] + ":00";

    return moment(new Date(appendApptDateTime)).format("YYYY-MM-DD HH:mm:ss");
};

exports.parseWithAddition = (dateTime, hr, min) => {
    const apptDate = dateTime.split(' ')[0].split('/');
    const apptTime = dateTime.split(' ')[1].split(':');
    const appendApptDateTime = apptDate[2] + "-" + apptDate[1] + "-" + apptDate[0] + " " + apptTime[0] + ":" + apptTime[1] + ":00";

    let newDateTime = moment(new Date(appendApptDateTime)).add(hr, 'hours').add(min, 'minutes');
    return newDateTime.format("YYYY-MM-DD HH:mm:ss");
};