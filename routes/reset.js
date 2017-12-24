let express = require('express');
let router = express.Router();
let db = require('../models/db');
const mongo = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;
let passwordHash = require('password-hash');

function validPassword(pwd) {
	let regex = /^\S*(?=\S{6,})(?=\S*[a-z])(?=\S*[A-Z])(?=\S*[\d])\S*$/;
	return regex.test(pwd);
}

router.get('/', (req, res) => {
	req.flash('error', "Login not found");
	res.redirect('/');
})

router.get('/:id', (req, res) => {
	if (req.session.login)
		res.redirect('/home');
	else {
		res.render("reset", {
			id: req.params.id
		});
	}
});

router.post('/:id/submit', async (req, res) => {

	let checkObjID = new RegExp("^[0-9a-fA-F]{24}$");
    if (checkObjID.test(req.params.id) === false) {
		req.flash('error', 'Invalid link');
        res.redirect('/reset/' + req.params.id);
	}
	else {
		let user = await db.findOne('users', {_id: objectId(req.params.id)});

		if (!user) {
			req.flash('error', "User not found");
            res.redirect('/reset/' + req.params.id);
		}
		else {
			if (!validPassword(req.body.password)) {
				req.flash('error', "Your new password must contain at least 6 characters with at least 1 uppercase 1 lowercase and 1 alphanumeric.");
				res.redirect('/reset/' + req.params.id);
			}
			else {
				await db.updateOne('users', { _id: objectId(req.params.id) }, { $set: { password: passwordHash.generate(req.body.password)} });
				req.flash('success', "Your password has been successfully changed");
            	res.redirect('/login');
		 	}
		}
	}
})

module.exports = router;
