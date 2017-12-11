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
	req.session.errors = [];
	req.session.errors.push({msg: 'No login found'});
	res.redirect('/');
})

router.get('/:id', (req, res) => {
	let errors = req.session.errors;
	let success = req.session.success;

	req.session.errors = [];
	req.session.success = [];

	if (req.session.login)
		res.redirect('/home');
	else {
		res.render("reset", {
			errors: errors,
			success: success,
			id: req.params.id
		});
	}
});

router.post('/:id/submit', async (req, res) => {
	req.session.errors = [];
	req.session.success = [];

	let checkObjID = new RegExp("^[0-9a-fA-F]{24}$");
    if (checkObjID.test(req.params.id) === false) {
        req.session.errors.push({msg: 'Page URL false'});
        res.redirect('/reset/' + req.params.id);
	}
	else {
		let user = await db.findOne('users', {_id: objectId(req.params.id)});

		if (!user) {
			req.session.errors.push({msg: 'User not found'});
            res.redirect('/reset/' + req.params.id);
		}
		else {
			if (!validPassword(req.body.password)) {
				req.session.errors.push({msg: 'Your new password must contain at least 6 characters with at least 1 uppercase 1 lowercase and 1 alphanumeric.'});
				res.redirect('/reset/' + req.params.id);
			}
			else {
				await db.updateOne('users', { _id: objectId(req.params.id) }, { $set: { password: passwordHash.generate(req.body.password)} })
            	req.session.success.push({msg: 'Your password has been changed'});
            	res.redirect('/login');
		 	}
		}
	}
})

module.exports = router;
