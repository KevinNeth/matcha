const express = require('express');
const router = express.Router();
const auth = require('../controllers/auth');
const SearchHelper = require('../controllers/searchHelper');
const db = require('../models/db');

router.get('/', auth, async (req, res, next) => {
	try {
		let query = req.query;
		let search = new SearchHelper(req.user);

		if (query.query) {
			search.filterName(query.query);
		}
		if (query.minAge && query.maxAge) {
			search.filterAge(parseInt(query.minAge), parseInt(query.maxAge));
		}
		if (query.minScore && query.maxScore) {
			search.filterScore(parseInt(query.minScore), parseInt(query.maxScore));
		}
		if (query.distance) {
			search.filterDistance(parseInt(query.distance));
		}
		if (query.interest) {
			if (query.interest.trim().replace(/\s+/g, "").length) {
				let interest = query.interest.trim().replace(/\s+/g, " ").split(" ");
				search.filterInterests(interest);
			}
		}
		if (query.suggestion) {
			search.sort(query.suggestion);
		}
		let results = await search.results();
		let maxScore = await db.max("users", "score");
		res.render('home', {
			info: results,
			maxScore: maxScore,
			searchQuery: query.query || '',
			filterMinAge: query.minAge || 18,
			filterMaxAge: query.maxAge || 100,
			filterMinScore: query.minScore || 0,
			filterMaxScore: query.maxScore || maxScore,
			filterDistance: query.distance || 0,
			filterInterests: query.interest || ''
		});
	} catch (e) {
		console.log(e);
		res.redirect('/login');
	}
});

module.exports = router;