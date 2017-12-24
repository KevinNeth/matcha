const express = require('express');
const router = express.Router();
const auth = require('../controllers/auth');
const Conversation = require('../models/conversation');
const User = require('../models/user');

router.get('/:to', auth, async (req, res) => {
    console.log(req.params);
    if (!req.params.to)
        res.redirect('/home');
    else {
        try {
            let messages = await Conversation.get(req.session.login, req.params.to);
            
            res.render("chat", {
                from: req.session.login,
                to: req.params.to,
                messages: messages
            });
        } catch(e) {
            console.log(e);
            res.redirect('/home');
        }
    }
});

module.exports = router;