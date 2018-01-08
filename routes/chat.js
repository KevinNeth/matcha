const express = require('express');
const router = express.Router();
const auth = require('../controllers/auth');
const Conversation = require('../models/conversation');
const User = require('../models/user');

router.get('/:to', auth, async (req, res) => {
    try {
        if (!(req.user.matchedWith(req.params.to)) || req.user.isBlockedBy(req.params.to))
            throw new Error('You are not authorized to chat with this user');
        let to = await req.user.lookup(req.params.to);
        let messages = await Conversation.get(req.session.login, req.params.to);
        
        res.render("chat", {
            from: req.session.login,
            to: req.params.to,
            messages: messages
        });
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('/');
    }
});

module.exports = router;