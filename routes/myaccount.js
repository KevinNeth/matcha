const express = require("express");
const router = express.Router();
const auth = require('../controllers/auth');
const db = require("../models/db.js");
const User = require("../models/user.js");
const multer = require('multer');
const path = require('path');
const NodeGeocoder = require('node-geocoder');

const options = {
    provider: 'google',
    httpAdapter: 'https',
    apiKey: 'AIzaSyAs78IwViXHXBxA3UjO0ZvfrFntqA1F4mU',
    formatter: null
};

const geocoder = NodeGeocoder(options);

let imageFilter = function (req, file, cb) {
    // accept image only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/)) {
        return cb(new Error('Only image files are allowed'), false);
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
    storage: storage,
    errorHandling: 'manual'
});

function validEmail(email) {
	let regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return regex.test(email);
}

router.get('/', auth, async (req, res) => {
    let user = req.user;
    res.render("myaccount", {
        login: user.login,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        gender: user.gender,
        birthday: user.birthday,
        orientation: user.orientation,
        location: user.tmpAddress,
        bio: user.bio,
        interest: user.interest,
        profilepic: user.profilepic,
        viewer: user.viewedBy,
        liker: user.likedBy,
        pic1: user.pic1,
        pic2: user.pic2,
        pic3: user.pic3,
        pic4: user.pic4
    });
});

router.post('/submit', auth, async (req, res) => {
    const change = Object.keys(req.body)[0];
    const modif = req.body[change];
    let error = false;

    if (!req.body[change].trim().replace(/\s+/g, "").length)
        error = "Invalid entry";
    else if (modif.length < 1 && change !== 'email')
        error = 'Invalid entry';
    else if (change === "gender" && modif !== "man" && modif !== "woman")
        error = 'Invalid entry';
    else if (change === "orientation" && modif !== "man" && modif !== "woman" && modif !== "both")
        error = 'Invalid entry';
    else if (change === 'email' && !validEmail(modif))
        error = 'Invalid email';

    if (error === false) {
        try {
            await db.updateOne("users", { login: req.session.login }, { $set: { [change] : modif }});
            req.flash('success', 'Successfully updated ' + change);            
        }
        catch(e) {
            req.flash('error', 'An error occurred');
            console.log(e);
        }
    } else {
        req.flash('error', error);
    }
    res.redirect('/myaccount');
});

router.post("/deleteInterest", auth, async (req, res) => {
    try {
        let user = await User.get(req.session.login);
        let interest = user.interest;
        interest.splice(req.body.id, 1);
        await db.updateOne("users", { login: req.session.login }, { $set: { interest: interest } });
    }
    catch(e) {
        console.log(e);
    }
});

router.post("/addInterest", auth, async (req, res) => {
    try {
        let user = await User.get(req.session.login);
        let checkspace = req.body.interest;
        let newinterest = req.body.interest;
        if (checkspace.trim().replace(/\s+/g, "").length) {
            newinterest = newinterest.trim().replace(/\s+/g, " ").split(" ");
            await db.updateOne("users", { login: req.session.login }, { $addToSet: { interest: { $each: newinterest }}});
        }
        else {
            req.flash("error", "Invalid entry");
        }
        res.redirect('/myaccount');
    }
    catch(e) {
        console.log(e);
    }
});

router.post("/profilepic", auth, async (req, res) => {
    const newPic = upload.single('profilepic');
    newPic(req, res, async (err) => {
        if (err) {
            req.flash('error', "Only image files are allowed");
            res.redirect('/myaccount');
        }
        else {
            try {
                await db.updateOne("users", { login: req.session.login }, { $set: { profilepic: req.file.filename, profilepicpath: req.file.path } });
                req.flash('success', "Profile picture successfully changed");
                res.redirect('/myaccount');
            }
            catch (e) {
                req.flash('error', 'An error occurred');
                console.log(e);
                res.redirect('/myaccount');
            }
        }
    })
})

router.post("/addpic1", auth, async (req, res) => {
    const newPic = upload.single('pic1');
    newPic(req, res, async (err) => {
        if (err) {
            req.flash('error', "Only image files are allowed");
            res.redirect('/myaccount');
        }
        else {
            try {
                await db.updateOne("users", { login: req.session.login }, { $set: { pic1: req.file.filename } });
                req.flash('success', "Photo successfully changed");
                res.redirect('/myaccount');
            }
            catch (e) {
                req.flash('error', 'An error occurred');
                console.log(e);
                res.redirect('/myaccount');
            }
        }
    })
})

router.post("/addpic2", async (req, res) => {
    const newPic = upload.single('pic2');
    newPic(req, res, async (err) => {
        if (err) {
            req.flash('error', "Only image files are allowed");
            res.redirect('/myaccount');
        }
        else {
            try {
                await db.updateOne("users", { login: req.session.login }, { $set: { pic2: req.file.filename } });
                req.flash('success', "Photo successfully changed");
                res.redirect('/myaccount');
            }
            catch (e) {
                req.flash('error', 'An error occurred');
                console.log(e);
                res.redirect('/myaccount');
            }
        }
    })
})

router.post("/addpic3", async (req, res) => {
    const newPic = upload.single('pic3');
    newPic(req, res, async (err) => {
        if (err) {
            req.flash('error', "Only image files are allowed");
            res.redirect('/myaccount');
        }
        else {
            try {
                await db.updateOne("users", { login: req.session.login }, { $set: { pic3: req.file.filename } });
                req.flash('success', "Photo successfully changed");
                res.redirect('/myaccount');
            }
            catch (e) {
                req.flash('error', 'An error occurred');
                console.log(e);
                res.redirect('/myaccount');
            }
        }
    })
})

router.post("/addpic4", async (req, res) => {
    const newPic = upload.single('pic4');
    newPic(req, res, async (err) => {
        if (err) {
            req.flash('error', "Only image files are allowed");
            res.redirect('/myaccount');
        }
        else {
            try {
                await db.updateOne("users", { login: req.session.login }, { $set: { pic4: req.file.filename } });
                req.flash('success', "Photo successfully changed");
                res.redirect('/myaccount');
            }
            catch (e) {
                req.flash('error', 'An error occurred');
                console.log(e);
                res.redirect('/myaccount');
            }
        }
    })
})

router.post("/modifLocation", async (req, res) => {
    if (req.body.location) {
        const info = await geocoder.geocode(req.body.location);
        if (info[0]) {
            await db.updateOne("users", { login: req.session.login }, {
                 $set: {
                    tmpAddress: info[0].formattedAddress,
                    tmpLat: info[0].latitude,
                    tmpLng: info[0].longitude,
                    location: {
                        type: "Point",
                        coordinates: [
                            parseFloat(info[0].longitude),
                            parseFloat(info[0].latitude)
                        ]
                    }
                }
            });
            req.flash('success', "Address successfully changed");
            res.redirect('/myaccount');
        }
        else {
            req.flash('error', "Invalid location");
            res.redirect('/myaccount');
        }
    }
    else {
        req.flash('error', "Invalid location");
        res.redirect('/myaccount');
    }
})

module.exports = router;