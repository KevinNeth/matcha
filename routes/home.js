let express = require('express');
let router = express.Router();
let db = require('../models/db');

router.get('/', async (req, res) => {
	if (req.session.login === undefined)
		res.redirect('/');
	else {
		let valueLog = await db.findOne('users', {login: req.session.login, firstConnection: true});
		console.log(valueLog);
		if (!valueLog) {
			console.log("bizare");
			console.log(valueLog);
			console.log("pas ici");
			res.redirect('/firstConnection');
		}
		else {
			console.log("quepasa ?");
			let both = await db.findOne('user', {login: req.session.login, orientation: "both"});
			console.log(both);
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
				console.log(valueMatch);
				res.render('home', {
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
				// let arrtest = valueMatch['interest'].split("");
				console.log(valueMatch);
				res.render('home', {
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
			console.log(both);
			if (both) {
				let valueMatch = await db.findSort('users', {
					firstConnection: false,
					orientation: {$in: [both.gender, "both"]},
					login: {$ne: req.session.login}
				},
				{ year: -1, month: -1, date: -1});
				console.log(valueMatch);
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
				console.log(valueMatch);
				res.render('home', {
					info: valueMatch
				});
			}
		}
	}
})

module.exports = router;
