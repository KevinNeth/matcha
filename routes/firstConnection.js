let express = require('express');
let router = express.Router();
let db = require('../models/db');
let User = require('../models/user');
let multer = require('multer');
let path = require('path');

let imageFilter = function (req, file, cb) {
    // accept image only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads');
    },
    filename: function(req, file, cb) {
        cb(null, req.session.login + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    fileFilter: imageFilter,
    storage: storage
});


router.get('/',  async (req, res) => {
	let errors = req.session.errors;

	req.session.errors = [];
	try {
		let user = await User.get(req.session.login);
		if (user.firstConnection === true) {
			res.render('firstConnection', {
				errors: errors
			});	
		} else {
			res.redirect('/home');				
		}
	} catch(e) {
		res.redirect('/logIn');
	}
});

router.post('/submit', upload.single('profilpic'), async (req, res) => {
	try {
		await db.updateOne('users', { login: req.session.login }, {
			$set: {
				firstname: req.body.firstname,
				lastname: req.body.lastname,
				bio: req.body.bio,
				interest: req.body.interest,
				profilepic: req.file.filename,
				profilepicpath: req.file.path,
				firstConnection: false
			}
		});
		res.redirect('/home');
	} catch(e) {
		console.log("MongoDB connection error.");
		res.redirect('/firstConnection');
	}
});

module.exports = router;