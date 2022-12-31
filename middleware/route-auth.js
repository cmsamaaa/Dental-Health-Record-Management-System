exports.isAuth = (req, res, next) => {
    if (!req.session.isLoggedIn)
        return res.redirect('/login');

    next();
};

exports.setSession = (req, res, next) => {
    res.locals._isLoggedIn = req.session.isLoggedIn ? true : false;

    if (req.session.isLoggedIn) {
        res.locals._userRole = req.session.userRole;
        res.locals._clinicId = req.session.userInfo.clinicId;
        res.locals._firstName = req.session.userInfo.firstName;
        res.locals._lastName = req.session.userInfo.lastName;
        res.locals._gender = req.session.userInfo.gender;
    }

    next();
};

exports.isPatient = (req, res, next) => {
    if (req.session.userRole !== 'Patient') {
        return res.redirect('/');
    }
    next();
};

exports.isAdmin = (req, res, next) => {
    if (req.session.userRole !== 'Administrator') {
        return res.redirect('/');
    }
    next();
};

exports.isDentist = (req, res, next) => {
    if (req.session.userRole !== 'Dentist' && req.session.userRole !== 'Dental Assistant') {
        return res.redirect('/');
    }
    next();
};