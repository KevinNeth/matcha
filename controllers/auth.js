const User = require('../models/user');

module.exports = async (req, res, next) => {
    try {
        let user = await User.get(req.session.login);
        if (user.firstConnection === false) {
            req.user = user;
            next();
        } else {
            res.redirect('/firstConnection');
        }
    } catch (e) {
        res.redirect('/signup');
    }
};