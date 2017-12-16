const express = require("express");
const router = express.Router();
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
    storage: storage,
    errorHandling: 'manual'
});

function validEmail(email) {
	let regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return regex.test(email);
}

router.get('/', async (req, res) => {
    let errors = [];
    let success = [];
    if (req.session.errors) {
        errors = req.session.errors;
        req.session.errors = [];
    }
    if (req.session.errors) {
        success = req.session.success;
        req.session.success = [];
    }
    if (req.session.login === undefined)
        res.redirect('/logIn');
    else {
        const user = await db.findOne("users", { login: req.session.login });
        res.render("myaccount", {
            errors: errors,
            success: success,
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
            pic1: user.pic1,
            pic2: user.pic2,
            pic3: user.pic3,
            pic4: user.pic4
        });
    }
});

router.post('/submit', async (req, res) => {
    req.session.errors = [];
    req.session.success = [];
    const change = Object.keys(req.body)[0];
    const modif = req.body[change];
    if (modif.length < 1 && change !== 'email')
        req.session.errors.push({msg: 'Too short modif'});
    if (change === "gender") {
        if (modif !== "man" && modif !== "woman")
            req.session.errors.push({msg: "Don't try to modif me !"});
    }
    if (change === "orientation") {
        if (modif !== "man" && modif !== "woman" && modif !== "both")
            req.session.errors.push({msg: "Don't try to modif me !"});
    }
    if (change === 'email')
        if (!validEmail(modif))
            req.session.errors.push({msg: 'Invalid email.'});
    if (req.session.errors.length === 0) {
        try {
            await db.updateOne("users", { login: req.session.login }, { $set: { [change] : modif }});
        }
        catch(e) {
            console.log(e);
        }
        req.session.success.push({msg: "Update done !"});
    }
    res.redirect('/myaccount');
    
});

router.post("/deleteInterest", async (req, res) => {
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

router.post("/addInterest", async (req, res) => {
    try {
        let user = await User.get(req.session.login);
        let interest = user.interest;
        let newinterest = req.body.interest;
        newinterest = newinterest.trim().replace(/\s\s+/g, ' ').split(" ");
        let finalinterest = interest.concat(newinterest);
        await db.updateOne("users", { login: req.session.login }, { $addToSet: { interest: { $each: newinterest }}});
        res.redirect('/myaccount');
    }
    catch(e) {
        console.log(e);
    }
})

router.post("/profilepic", async (req, res) => {
    req.session.success = [];
    req.session.errors = [];
    const newPic = upload.single('profilepic');
    newPic(req, res, async (err) => {
        if (err) {
            req.session.errors.push({msg: "Only image allow !"});
            res.redirect('/myaccount');
        }
        else {
            try {
                await db.updateOne("users", { login: req.session.login }, { $set: { profilepic: req.file.filename, profilepicpath: req.file.path } });
                req.session.success.push({msg: "Profile picture change !"});
                res.redirect('/myaccount');
            }
            catch (e) {
                req.session.errors.push({msg: "Un probleme est survenu"});
                res.redirect('/myaccount');
                console.log(e);
            }
        }
    })
})

router.post("/addpic1", async (req, res) => {
    req.session.success = [];
    req.session.errors = [];
    const newPic = upload.single('pic1');
    newPic(req, res, async (err) => {
        if (err) {
            req.session.errors.push({msg: "Only image allow !"});
            res.redirect('/myaccount');
        }
        else {
            try {
                await db.updateOne("users", { login: req.session.login }, { $set: { pic1: req.file.filename } });
                req.session.success.push({msg: "1st picture change !"});
                res.redirect('/myaccount');
            }
            catch (e) {
                req.session.errors.push({msg: "Un probleme est survenu"});
                res.redirect('/myaccount');
                console.log(e);
            }
        }
    })
})

router.post("/addpic2", async (req, res) => {
    req.session.success = [];
    req.session.errors = [];
    const newPic = upload.single('pic2');
    newPic(req, res, async (err) => {
        if (err) {
            req.session.errors.push({msg: "Only image allow !"});
            res.redirect('/myaccount');
        }
        else {
            try {
                await db.updateOne("users", { login: req.session.login }, { $set: { pic2: req.file.filename } });
                req.session.success.push({msg: "2nd picture change !"});
                res.redirect('/myaccount');
            }
            catch (e) {
                req.session.errors.push({msg: "Un probleme est survenu"});
                res.redirect('/myaccount');
                console.log(e);
            }
        }
    })
})

router.post("/addpic3", async (req, res) => {
    req.session.success = [];
    req.session.errors = [];
    const newPic = upload.single('pic3');
    newPic(req, res, async (err) => {
        if (err) {
            req.session.errors.push({msg: "Only image allow !"});
            res.redirect('/myaccount');
        }
        else {
            try {
                await db.updateOne("users", { login: req.session.login }, { $set: { pic3: req.file.filename } });
                req.session.success.push({msg: "3rd picture change !"});
                res.redirect('/myaccount');
            }
            catch (e) {
                req.session.errors.push({msg: "Un probleme est survenu"});
                res.redirect('/myaccount');
                console.log(e);
            }
        }
    })
})

router.post("/addpic4", async (req, res) => {
    req.session.success = [];
    req.session.errors = [];
    const newPic = upload.single('pic4');
    newPic(req, res, async (err) => {
        if (err) {
            req.session.errors.push({msg: "Only image allow !"});
            res.redirect('/myaccount');
        }
        else {
            try {
                await db.updateOne("users", { login: req.session.login }, { $set: { pic4: req.file.filename } });
                req.session.success.push({msg: "4th picture change !"});
                res.redirect('/myaccount');
            }
            catch (e) {
                req.session.errors.push({msg: "Un probleme est survenu"});
                res.redirect('/myaccount');
                console.log(e);
            }
        }
    })
})

router.post("/modifLocation", async (req, res) => {
    req.session.success = [];
    req.session.errors = [];
    const info = await geocoder.geocode(req.body.location);
    if (info[0]) {
        console.log('ici');
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
        req.session.success.push({msg: "Address change !"});
        res.redirect('/myaccount');
    }
    else {
        req.session.errors.push({msg: "Localisation invalide !"});
        res.redirect('/myaccount');
    }
})

module.exports = router;