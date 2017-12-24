let express = require('express');
let router = express.Router();
let db = require('../models/db');
let nodemailer = require('nodemailer');
let smtpTransport = require('nodemailer-smtp-transport');

router.get('/', (req, res) => {
	if (req.session.login)
		res.redirect('/home');
	res.render("forgotPass");
});

router.post('/submit', async (req, res) => {
	let user = await db.findOne('users', {email: req.body.email});

	if (!user) {
		req.flash('error', "A user with that email was not found");
		res.redirect('/forgotpass');
	}
	else {
		req.flash('success', "Password reset email sent");

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
