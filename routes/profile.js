const express = require("express");
const router = express.Router();
const auth = require('../controllers/auth');
const db = require("../models/db");
const User = require('../models/user');

router.get('/user/:login', auth, async (req, res) => {
    if (req.session.login === req.params.login)
        res.redirect("/myaccount");
    else {
        try {
            const user = await req.user.view(req.params.login);
            res.render("profile", {
                login: user.login,
                firstname: user.firstname,
                lastname: user.lastname,
                gender: user.gender,
                age: user.age,
                orientation: user.orientation,
                location: user.location,
                bio: user.bio,
                interest: user.interest,
                profilepic: user.profilepic,
                user: req.params.login,
                pic1: user.pic1,
                pic2: user.pic2,
                pic3: user.pic3,
                pic4: user.pic4,
                score: user.score,
                isLike: user.isLikedBy(req.user.login)
            });
        } catch(e) {
            console.log(e);
            req.flash('error', "User not found");
            res.redirect('/home');
        }
    }
});

router.post('/findUser', auth, async (req, res) => {
    try {
        const user = await req.user.lookup(req.body.user);
        res.redirect('/profile/user/' + req.body.user);
    } catch(e) {
        req.flash('error', "User not found");
        res.redirect('/home');
    }
});

router.get('/addLike/:login', auth, async (req, res) => {
    if (req.session.login === req.params.login)
        res.redirect("/myaccount");
    else {
        try {
            await req.user.like(req.params.login);
            res.redirect('/profile/user/' + req.params.login);                
        } catch(e) {
            console.log(e);
            req.flash('error', "User not found");
            res.redirect('/home');
        }
    }
});

router.get('/disLike/:login', auth, async (req, res) => {
    console.log('ici');
    if (req.session.login === req.params.login)
        res.redirect("/myaccount");
    else {
        try {
            await req.user.unlike(req.params.login);
            res.redirect('/profile/user/' + req.params.login);
        } catch (e) {
            req.flash('error', "User not found");            
            res.redirect('/home');
        }
    }
});

router.get('/block/:login', auth, async (req, res) => {
    if (req.session.login === req.params.login)
        res.redirect("/myaccount");
    else {
        try {
            await req.user.block(req.params.login);
            const user = await db.findOne('users', { login: req.params.login });
            req.flash('success', "You have successfully blocked " + req.params.login);
            res.redirect('/home');
        } catch (e) {
            req.flash('error', "User not found");
            res.redirect('/home');
        }
    }
});

module.exports = router;