let PORT = 3000;
if (process.env.ENV !== "test")
    PORT = process.env.PORT || 3000;
else
    PORT = process.env.PORT || 3001;

exports.parse = (req, endpoint) => {
    let host = req.protocol + '://' + req.hostname
    if (process.env.URI_IGNORE_PORT !== '1')
         host += ':' + PORT
    return host + endpoint;
}