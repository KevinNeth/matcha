let express = require('express');
let router = express.Router();

router.get('/', (req, res) => {
    req.session.login = undefined;
    res.redirect('/login');
})

module.exports = router;