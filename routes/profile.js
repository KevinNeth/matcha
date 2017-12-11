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
            console.log(req.params.user);
            const user = await db.findOne('users', {login: req.params.user});
            console.log(user);
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

module.exports = router;