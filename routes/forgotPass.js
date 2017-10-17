let express = require('express');
let router = express.Router();
let model = require('../models/database');
let nodemailer = require('nodemailer');
let smtpTransport = require('nodemailer-smtp-transport');

router.get('/', (req, res) => {
	if (req.session.login)
		res.redirect('/home');
	let errors = req.session.errors;
	let success = req.session.success;

	req.session.errors = [];
	req.session.success = [];
	res.render("forgotPass", {
		errors: errors,
		success: success
	});
});

router.post('/submit', async (req, res) => {
	req.session.errors = [];
	req.session.success = [];
	let db = await model.connectToDatabase();
	let email = await db.collection('users').findOne({email: req.body.email});

	if (!email) {
		req.session.errors.push({msg: "Email not found."});
		res.redirect('/forgotpass');
	}
	else {
		req.session.success.push({msg: "Email sent."});

		let transporter = nodemailer.createTransport(smtpTransport({
			service: 'gmail',
			auth: {
				user: 'matchakneth@gmail.com',
				pass: 'MATCHA125'
			},
			tls: { rejectUnauthorized: false }
		}));

		let mailOptions = {
			from: '"Matcha" <42matcha2017@gmail.com>',
			to: req.body.email,
			subject: 'Hello - Reset Password - Matcha',
			html: '<p>Hello</p><br><p>To reset your password, click the link below<p><a href="http://localhost:8080/reset/' + email['_id'] + '">Reset password</a><br><br><br>Team Matcha'
		}

		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				return ;
			}
		});
		res.redirect('/forgotpass');
	}
});

module.exports = router;
