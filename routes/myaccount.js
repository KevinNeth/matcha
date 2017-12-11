const express = require("express");
const router = express.Router();
const db = require("../models/db");

function validEmail(email) {
	let regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return regex.test(email);
}

router.get('/', async (req, res) => {
    req.session.login = 'tanguy';
    if (req.session.login === undefined)
        res.redirect('/logIn');
    else {
        const user = await db.findOne('users', { login: req.session.login });
        console.log(user);
        res.render("myaccount", {
            login: user.login,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            gender: user.gender,
            birthday: user.birthday,
            orientation: user.orientation,
            location: user.location,
            bio: user.bio,
            interest: user.interest,
            profilepic: user.profilepic
        });
    }
});

router.post('/submit', (req, res) => {
    req.session.errors = [];
    const change = Object.keys(req.body)[0];
    const modif = req.body[change];
    console.log(modif);
    console.log(modif.length);
    if (modif.length < 1) {
        req.session.errors.push({msg: 'Too short modif'});
        res.redirect('/myaccount');
    }
    if (change === 'email') {
        if (!validEmail(modif)) {
            req.session.errors.push({msg: 'Invalid email.'});
            res.redirect('/myaccount');
        }
    }
    
});

module.exports = router;