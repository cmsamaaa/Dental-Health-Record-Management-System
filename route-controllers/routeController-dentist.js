const HTTP_STATUS = require("../constants/http_status");

exports.viewAppointments = async (req, res, next) => {
    res.status(HTTP_STATUS.OK).render('table/dentist-appointments', {
        pageTitle: 'Appointment',
        path: '/dentist/appointment/view-all'
    });
};