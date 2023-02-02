const _ = require('lodash');
const moment = require('moment');
const parse_uri = require("../lib/parse_uri");
const HTTP_STATUS = require("../constants/http_status");
const Participant = require("../entities/participant");

exports.addParticipant = async (req, res, next) => {
    // Get participant data
    const participant = new Participant({
        apptId: req.body.apptId,
        staffId: req.body.staffId
    });
    let participantData = await participant.getParticipant();

    if (!participantData)
        participantData = await participant.addParticipant();

    res.redirect(parse_uri.parse(req, '/dentist/appointment/in-session'));
};

exports.deleteParticipant = async (req, res, next) => {
    // Delete participant record
    const participant = new Participant({
        apptId: req.body.apptId,
        staffId: req.body.staffId
    });
    const participantData = await participant.deleteParticipants();

    res.redirect(parse_uri.parse(req, '/dentist/appointment/in-session'));
};