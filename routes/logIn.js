const express = require('express');
const router = express.Router();
const User = require('../models/user');
let db = require('../models/db');
let passwordHash = require('password-hash');

router.get('/', (req, res) => {
	if (req.session.login)
		res.redirect('/');
	else
		res.render("login");
});

router.post('/submit', async (req, res, next) => {
	try {
		let user = await User.get(req.body.login);
		if (passwordHash.verify(req.body.password, user.password) === true) {
			req.session.login = user.login;
			req.flash('success', 'Welcome back, ' + user.login);
			res.redirect('/');
		} else {
			throw new Error('Invalid password.');
		}
	} catch(e) {
		req.session.login = undefined;
		req.flash('error', 'Invalid username or password');
		res.redirect('/login');
	}
});

module.exports = router;
