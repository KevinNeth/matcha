let express = require('express');
let router = express.Router();
let db = require('../models/db');
let passwordHash = require('password-hash');

router.get('/', (req, res) => {
	if (req.session.login)
		res.redirect('/home');
	else {
		res.render("signUp");
	}
});

function validEmail(email) {
	console.log("emailbit");
	let regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return regex.test(email);
}

function validPassword(pwd) {
	let regex = /^\S*(?=\S{6,})(?=\S*[a-z])(?=\S*[A-Z])(?=\S*[\d])\S*$/;
	return regex.test(pwd);
}

function validLogin(login) {
	console.log("test");
	let regex = /^[a-z0-9]+$/i;
	return regex.test(login);
}
// 1er check des inputs

router.post('/submit', (req, res, next) => {
	req.session.numErr = 0;

	if (req.body.gender !== "man" && req.body.gender !== "woman") {
		req.flash("error", "Stop trying voodoo magic, Harry -_-");
		req.session.numErr += 1;
	}
	if (req.body.orientation !== "man" && req.body.orientation !== "woman" && req.body.orientation !== "both") {
		req.flash("error", "Stop trying voodoo magic, Harry -_-");
		req.session.numErr += 1;
	}
	if (!validEmail(req.body.email)) {
		req.flash("error", "Invalid email");
		req.session.numErr += 1;
	}
	if (!validLogin(req.body.login)) {
		req.flash("error", "Invalid login");
		req.session.numErr += 1;
	}
	if (req.body.login.length < 4) {
		req.flash("error", 'Your login must contain at least 5 characters');
		req.session.numErr += 1;
	}
	if (!validPassword(req.body.password)) {
		req.flash("error", 'Your password must contain at least 6 characters with at least 1 uppercase 1 lowercase and 1 alphanumeric.');
		req.session.numErr += 1;
	}
	if (req.body.password.localeCompare(req.body.confirm)) {
		req.flash("error", 'Password confirmation error.');
		req.session.numErr += 1;
	}
	next();
});

// 2eme check des inputs par rapport a la base de donnee

router.post('/submit', async (req, res, next) => {
	let valueLog = await db.findOne('users', {login: req.body.login.toLowerCase()});
	let valueEmail = await db.findOne('users', {email: req.body.email.toLowerCase()});

	if (valueLog) {
		req.flash("error", 'Login is already taken');
		req.session.numErr += 1;
	}
	if (valueEmail) {
		req.flash("error", 'Email is already taken');
		req.session.numErr += 1;
	}
	if (req.session.numErr === 0)
		next();
	else {
		res.redirect('/signup');
	}
})

// Insert les infos verifier.

router.post('/submit', async (req, res) => {
	if (!req.body.login.trim().replace(/\s+/g, "").length) {
		req.flash("error", "Invalid login");
		res.redirect("/signup");
	}
	else {
		let info = {
			login: req.body.login.toLowerCase(),
			email: req.body.email,
			password: passwordHash.generate(req.body.password),
			gender: req.body.gender,
			orientation: req.body.orientation,
			birthday: new Date(req.body.birthday),
			firstConnection: true
		};
		req.flash('success', "Registration completed successfully, please log in");
		db.insertOne('users', info);
		res.redirect('/login');
	}
})

module.exports = router;
