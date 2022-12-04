const request = require('request');
const parse_uri = require("../lib/parse_uri");
const HTTP_STATUS = require("../constants/http_status");

exports.addClinicInfo = async (req, res, next) => {
    // api endpoint uri
    const uri = parse_uri.parse(req, '/api/info/create');
    request.post({
        url: uri,
        form: req.body
    }, (err, response, body) => {
        if (response.statusCode === HTTP_STATUS.CREATED)
            res.redirect(parse_uri.parse(req, '/admin/clinic/view-all?create=' + JSON.parse(body).isCreated));
        else
            res.redirect(parse_uri.parse(req, '/admin/clinic/add-information?error=true'));
    });
};