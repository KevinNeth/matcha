const express = require('express');
const router = express.Router();
const auth = require('../controllers/auth');
const SearchHelper = require('../controllers/searchHelper');
const db = require('../models/db');

router.get('/', auth, async (req, res, next) => {
	try {
		let query = req.query;
		console.log("-----");
		console.log(query);
		console.log("-----");
		let search = new SearchHelper(req.user);

		console.log(query.minAge);
		if (query.minAge && query.maxAge) {
			search.filterAge(parseInt(query.minAge), parseInt(query.maxAge));
			console.log("age");
		}
		if (query.minScore && query.maxScore) {
			search.filterScore(parseInt(query.minScore), parseInt(query.maxScore));
			console.log("Score");
		}
		if (query.distance) {
			search.filterDistance(parseInt(query.distance));
			console.log("distance");
		}
		if (query.interest) {
			if (query.interest.trim().replace(/\s+/g, "").length) {
				let interest = query.interest.trim().replace(/\s+/g, " ").split(" ");
				search.filterInterests(interest);
			}
		}
		search.sort(query.sort);
		// console.log(search.query);
		// console.log("-----");
		// console.log(search.sortOption);
		// console.log("-----");
		// console.log(req.user.location);
		// console.log("-----");
		let results = await search.results();
		console.log(results);
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

// good basic

// { login: { '$ne': 'manwoman1' },
// firstConnection: false,
// orientation: { '$in': [ 'man', 'both' ] },
// blockedBy: { '$ne': 'manwoman1' },
// gender: 'woman' }

// problem

// { login: { '$ne': 'manwoman1' },
// firstConnection: false,
// orientation: { '$in': [ 'man', 'both' ] },
// blockedBy: { '$ne': 'manwoman1' },
// gender: 'woman',
// score: { '$gte': '0', '$lte': '170' },
// location:
//  { '$nearSphere': { '$geometry': [Object], '$maxDistance': 596000 } } }