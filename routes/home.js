let express = require('express');
let router = express.Router();
let model = require('../models/database');

router.get('/', async (req, res) => {
	if (req.session.login === undefined)
		res.redirect('/');
	else {
		let db = await model.connectToDatabase();
		let valueLog = await db.collection('users').findOne({login: req.session.login, firstConnection: "no"});
		console.log(valueLog);
		if (!valueLog) {
			res.redirect('/firstConnection');
		}
		else {
			let both = await db.collection('users').findOne({login: req.session.login, orientation: "both"});
			console.log(both);
			if (both) {
				let valueMatch = await model.getData('users', {
					firstConnection: "no",
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
				let valueMatch = await model.getData('users', {
					firstConnection: "no",
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
		let db = await model.connectToDatabase();
		let valueLog = await db.collection('users').findOne({login: req.session.login, firstConnection: "no"});
		if (!valueLog) {
			res.redirect('/firstConnection');
		}
		else {
			let both = await db.collection('users').findOne({login: req.session.login, orientation: "both"});
			console.log(both);
			if (both) {
				let valueMatch = await model.getDataSorted('users', {
					firstConnection: "no",
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
				let valueMatch = await model.getDataSorted('users', {
					firstConnection: "no",
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
