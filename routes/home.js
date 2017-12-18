let express = require('express');
let router = express.Router();
let db = require('../models/db');
const User = require('../models/user');
const SearchHelper = require('../controllers/searchHelper');

router.get('/', async (req, res) => {
	errors = [];
	if (req.session.errors) {
		errors = req.session.errors;
		req.session.errors = [];
	}
	try {
		let user = await User.get(req.session.login);
		let search = new SearchHelper(user);
		let results = await search.results();
		res.render('home', {
			errors: errors,
			info: results
		});
	} catch(e) {
		res.redirect('/');
	}
});

router.post('/filter', async (req, res, next) => {
	if (req.session.login === undefined)
		res.redirect('/');
	else {
		try {
			let user = await User.get(req.session.login);
			let search = new SearchHelper(user);
			if (req.body.minAge || req.body.maxAge)
				search.filterAge(req.body.minAge, req.body.maxAge);
			if (req.body.minScore || req.body.maxScore)
				search.filterScore(req.body.minScore, req.body.maxScore);
			if (req.body.distance)
				search.filterDistance(req.body.distance);
			if (req.body.interest) {
				let interest = req.body.interest.trim().replace(/\s\s+/g, ' ').split(" ");
				search.filterInterests(interest);
			}
			search.sort(req.body.sort);
			console.log(search.query);
			let results = await search.results();
			console.log(results);
			res.render('home', {
				errors: errors,
				info: results
			});
		} catch (e) {
			console.log(e);
			req.session.errors.push({ msg: "An error occurred." });
			res.redirect('/home');
		}
	}
});

module.exports = router;
