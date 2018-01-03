const express = require('express');
const router = express.Router();
const auth = require('../controllers/auth');
const SearchHelper = require('../controllers/searchHelper');
const db = require('../models/db');

router.get('/', auth, async (req, res, next) => {
	try {
		let query = req.query;
		console.log(query);
		let search = new SearchHelper(req.user);

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
		console.log(search.query);
		console.log(search.sortOption);
		console.log(req.user.location);
		let results = await search.results();
		let maxScore = await db.max("users", "score");
		res.render('home', {
			info: results,
			maxScore: maxScore
		});
	} catch (e) {
		console.log(e);
		res.redirect('/login');
	}
});

module.exports = router;
