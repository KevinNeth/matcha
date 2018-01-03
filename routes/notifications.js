let express = require('express');
let router = express.Router();
const Conversation = require('../models/conversation');
const Notification = require('../models/notification');
const User = require('../models/user');
const auth = require('../controllers/auth');

router.get('/', async (req, res) => {
    if (!req.session.login)
        res.redirect('/home');
    else {
        try {
            let notifications = await Notification.getAll(req.session.login);
            Notification.markAllRead(req.session.login);
            res.render("notifications", {
                notifications: notifications
            });
        } catch(e) {
            console.log(e);
            res.redirect('/home');
        }
    }
});

module.exports = router;