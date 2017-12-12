let express = require('express');
let router = express.Router();
let db = require('../models/db');
let passwordHash = require('password-hash');

router.get('/', (req, res) => {
	if (req.session.login)
		res.redirect('/home');
	else {
		let errors = req.session.errors;
	
		req.session.errors = [];
		res.render("signUp",{
			errors: errors
		});
	}
});

function validEmail(email) {
	let regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return regex.test(email);
}

function validPassword(pwd) {
	let regex = /^\S*(?=\S{6,})(?=\S*[a-z])(?=\S*[A-Z])(?=\S*[\d])\S*$/;
	return regex.test(pwd);
}

// 1er check des inputs

router.post('/submit', (req, res, next) => {
	console.log("purer");
	req.session.errors = [];
	if (!validEmail(req.body.email))
		req.session.errors.push({msg: 'Invalid email.'});
	if (req.body.login.length < 4)
		req.session.errors.push({msg: 'Your login must contain at least 5 characters'});
	if (!validPassword(req.body.password))
		req.session.errors.push({msg: 'Your password must contain at least 6 characters with at least 1 uppercase 1 lowercase and 1 alphanumeric.'});
	if (req.body.password.localeCompare(req.body.confirm))
		req.session.errors.push({msg: 'Password confirmation error.'});
	next();
});

// 2eme check des inputs par rapport a la base de donnee

router.post('/submit', async (req, res, next) => {
	console.log("purermdrxd");
	let valueLog = await db.findOne('users', {login: req.body.login.toLowerCase()});
	let valueEmail = await db.findOne('users', {email: req.body.email.toLowerCase()});

	if (valueLog)
		req.session.errors.push({msg: 'Login is already taken'});
	if (valueEmail)
		req.session.errors.push({msg: 'Email is already taken'});
	if (req.session.errors.length === 0)
		next();
	else
		res.redirect('/');
})

// Insert les infos verifier.

router.post('/submit', (req, res) => {
	// console.log(req.body.birthday);
	console.log("putain");
	let info = {
		login: req.body.login,
		email: req.body.email,
		password: passwordHash.generate(req.body.password),
		gender: req.body.gender,
		orientation: req.body.orientation,
		birthday: Date(req.body.birthday),
		firstConnection: true
	};
	req.session.success = [];
	req.session.success.push({msg: 'Registration success, you can now login.'});
	db.insertOne('users', info);
	res.redirect('/login');
})

module.exports = router;
