let express = require('express');
let router = express.Router();
let model = require('../models/database');
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
	if (req.session.login === undefined)
		res.redirect('/');
	else {
		let db = await model.connectToDatabase();
		let valueLog = await db.collection('users').findOne({login: req.session.login, firstConnection: "yes"});
		if (valueLog) {
			res.render('firstConnection', {
				errors: errors
			});
		}
		else {
			res.redirect('/home');
		}
	}
});

router.post('/submit', upload.single('profilpic'), async (req, res) => {
	await model.updateData('users', { login: req.session.login }, {
		$set: {
			firstname: req.body.firstname,
			lastname: req.body.lastname,
			bio: req.body.bio,
			interest: req.body.interest,
			profilepic: req.file.filename,
			profilepicpath: req.file.path,
			firstConnection: "no"
		}
	})
	res.redirect('/home');
})

module.exports = router;