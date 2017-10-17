let express = require('express');
let router = express.Router();
let model = require('../models/database');

router.get('/', async (req, res) => {
	if (req.session.login === undefined)
		res.redirect('/');
	else {
		let db = await model.connectToDatabase();
		let valueLog = await db.collection('users').findOne({login: req.session.login, firstConnection: "no"});
		if (!valueLog) {
			res.redirect('/firstConnection');
		}
		else {
			let both = await db.collection('users').findOne({login: req.session.login, orientation: "both"});
			if (both) {
				let valueMatch = await model.getData('users', {firstConnection: "no"});
				res.render('home', {
					info: valueMatch
				});
			}
			else {
				let valueMatch = await model.getData('users', {gender: valueLog.orientation, firstConnection: "no"});
				// let arrtest = valueMatch['interest'].split("");
				console.log(valueMatch);
				res.render('home', {
					info: valueMatch
				});
			}

		}
	}
});

module.exports = router;
