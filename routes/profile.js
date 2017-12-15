const express = require("express");
const router = express.Router();
const db = require("../models/db");

router.get('/:user', async (req, res) => {
    if (req.session.login === undefined)
        res.redirect("/logIn");
    else {
        if (req.session.login === req.params.user)
            res.redirect("/myaccount");
        else {
            const user = await db.findOne('users', {login: req.params.user});
            res.render("profile", {
                login: user.login,
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
    }
});

router.post('/findUser', async (req, res) => {
    req.session.errors = [];
    const user = await db.findOne('users', { login: req.body.user, firstConnection: false });
    if (user) {
        res.redirect('/profile/' + req.body.user);
    }
    else {
        req.session.errors.push({msg: "User not found"});
        res.redirect('/home');
    }
})

module.exports = router;