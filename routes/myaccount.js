const express = require("express");
const router = express.Router();
const db = require("../models/db.js");
const User = require("../models/user.js");

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
            location: user.location,
            bio: user.bio,
            interest: user.interest,
            profilepic: user.profilepic
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
        newinterest = newinterest.replace(/\s\s+/g, ' ').split(" ");
        let finalinterest = interest.concat(newinterest);
        await db.updateOne("users", { login: req.session.login }, { $set: { interest: finalinterest } });
        res.redirect('/myaccount');
    }
    catch(e) {
        console.log(e);
    }
})

module.exports = router;