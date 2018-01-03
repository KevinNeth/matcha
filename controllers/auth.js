const User = require('../models/user');
const Notification = require('../models/notification');

module.exports = async (req, res, next) => {
    try {
        let user = await User.get(req.session.login);
        if (user.firstConnection === false) {
            req.user = user;
            res.locals.unread = await Notification.unreadCount(req.session.login);
            next();
        } else {
            res.redirect('/firstConnection');
        }
    } catch (e) {
        res.redirect('/signup');
    }
};