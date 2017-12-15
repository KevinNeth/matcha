let express = require('express');
let router = express.Router();
let db = require('../models/db');

router.get('/', async (req, res) => {
	errors = [];
	if (req.session.errors) {
		errors = req.session.errors;
		req.session.errors = [];
	}

	if (req.session.login === undefined)
		res.redirect('/');
	else {
		let valueLog = await db.findOne('users', {login: req.session.login, firstConnection: false})
		if (!valueLog) {
			res.redirect('/firstConnection');
		}
		else {
			let both = await db.findOne('user', {login: req.session.login, orientation: "both"});
			if (both) {
				let valueMatch = await db.find('users', {
					firstConnection: false,
					orientation: {$in: [both.gender, "both"]},
					login: {$ne: req.session.login}, 
					location: {
						$nearSphere: {
							$geometry: {
								type: "Point",
								coordinates: [parseFloat(both.tmpLng), parseFloat(both.tmpLat)]
							},
							$minDistance: 0,
							$maxDistance: 100000
						}
					}
				});
				res.render('home', {
					errors: errors,
					info: valueMatch
				});
			}
			else {
				let valueMatch = await db.find('users', {
					firstConnection: false,
					gender: valueLog.orientation,
					orientation: {$in: [valueLog.gender, "both"]},
					location: {
						$nearSphere: {
							$geometry: {
								type: "Point",
								coordinates: [parseFloat(valueLog.tmpLng), parseFloat(valueLog.tmpLat)]
							},
							$minDistance: 0,
							$maxDistance: 100000
						}
					}
				});
				res.render('home', {
					errors: errors,
					info: valueMatch
				});
			}
		}
	}
});

router.post('/location', async (req, res) => {
	if (req.session.login === undefined)
		res.redirect('/');
	else
		res.redirect('/home');
})

router.post('/age', async (req, res) => {
	if (req.session.login === undefined)
		res.redirect('/');
	else {
		let valueLog = await db.findOne('users', {login: req.session.login, firstConnection: true});
		if (!valueLog) {
			res.redirect('/firstConnection');
		}
		else {
			let both = await db.findOne('user', {login: req.session.login, orientation: "both"});
			if (both) {
				let valueMatch = await db.findSort('users', {
					firstConnection: false,
					orientation: {$in: [both.gender, "both"]},
					login: {$ne: req.session.login}
				},
				{ year: -1, month: -1, date: -1});
				res.render('home', {
					info: valueMatch
				});
			}
			else {
				let valueMatch = await db.findSort('users', {
					firstConnection: false,
					gender: valueLog.orientation,
					orientation: {$in: [valueLog.gender, "both"]},
					login: {$ne: req.session.login}
					},
					{ year: -1, month: -1, date: -1});
				res.render('home', {
					info: valueMatch
				});
			}
		}
	}
})

module.exports = router;
