const Appointment = require("../entities/appointment");
const Queue = require("../entities/queue");

exports.updateMissedAppt = async (req, res, next) => {
    const appointment = new Appointment();
    await appointment.updateAllMissedAppointment();

    next();
};

exports.updateMissedQueue = async (req, res, next) => {
    const queue = new Queue();
    await queue.updateAllMissedQueue();

    next();
};