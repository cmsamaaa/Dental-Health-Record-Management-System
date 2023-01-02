const Appointment = require("../entities/appointment");

exports.updateMissed = async (req, res, next) => {
    const appointment = new Appointment();
    await appointment.updateAllMissedAppointment();

    next();
};