let express = require('express');
let router = express.Router();

router.get('/', (req, res) => {
    if (!req.session.login)
        res.redirect('/home');
    else {
        let errors = req.session.errors;
        let success = req.session.success;

        req.session.errros = [];
        req.session.success = [];
        res.render("chat", {
            errors: errors,
            success: success
        });
}
});

module.exports = router;