let express = require('express');
let router = express.Router();
let model = require('../models/database');
let passwordHash = require('password-hash');

router.get('/', (req, res) => {
	if (req.session.login)
		res.redirect('/home');
	else {
		let errors = req.session.errors;
		let success = req.session.success;

		req.session.errros = [];
		req.session.success = [];
		res.render("logIn", {
			errors: errors,
			success: success
		});
	}
});

router.post('/submit', async (req, res, next) => {
	req.session.errors = [];
	let db = await model.connectToDatabase();
	let info = await db.collection('users').findOne({login: req.body.login});

	if (info) {
		if (passwordHash.verify(req.body.password, info['password']) === true) {
			req.session.login = info['login'];
			res.redirect('/home');
		}
		else {
			req.session.errors.push({msg: 'Invalid password.'});
			res.redirect('/login');
		}
	}
	else {
		req.session.login = undefined;
		req.session.errors.push({msg: 'Login does not exist.'});
		res.redirect('/login');
	}
});

module.exports = router;
