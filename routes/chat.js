let express = require('express');
let router = express.Router();
const Conversation = require('../models/conversation');

router.get('/:to', async (req, res) => {
    console.log(req.params);
    if (!req.session.login)
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