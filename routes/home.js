let express = require('express');
let router = express.Router();
let db = require('../models/db');
const User = require('../models/user');
const SearchHelper = require('../controllers/searchHelper');

// router.get('/', async (req, res) => {
// 	errors = [];
// 	if (req.session.errors) {
// 		errors = req.session.errors;
// 		req.session.errors = [];
// 	}
// 	try {
// 		let user = await User.get(req.session.login);
// 		let search = new SearchHelper(user);
// 		let results = await search.results();
// 		res.render('home', {
// 			errors: errors,
// 			info: results
// 		});
// 	} catch(e) {
// 		res.redirect('/');
// 	}
// });

router.get('/', async (req, res, next) => {
	try {
		let query = req.query;
		let user = await User.get(req.session.login);
		if (user.firstConnection === false) {
			let search = new SearchHelper(user);

			if (query.minAge || query.maxAge)
				search.filterAge(query.minAge, query.maxAge);
			if (query.minScore || query.maxScore)
				search.filterScore(query.minScore, query.maxScore);
			if (query.distance)
				search.filterDistance(query.distance);
			if (query.interest) {
				let interest = query.interest.trim().split(/\s\s+/g);
				search.filterInterests(interest);
			}
			search.sort(query.sort);
			let results = await search.results();
			res.render('home', {
				errors: [],
				info: results
			});
		} else {
			res.redirect('/firstConnection');
		}
	} catch (e) {
		console.log(e);
		// req.session.errors.push({ msg: "An error occurred." });
		res.redirect('/login');
	}
});

module.exports = router;
