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
            const user = await User.lookup(req.params.login, req.session.login);
            console.log(user);
            if (User.isBlocked(user, req.session.login)) {
                throw new Error('User not found.');
            } else {
                let isLike = User.isLiked(user, req.session.login);
                await User.view(req.params.login, req.session.login);
                res.render("profile", {
                    login: user.login,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    gender: user.gender,
                    age: User.age(user.birthday),
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
                    isLike: isLike
                });
            }
        } catch(e) {
            console.log(e);
            req.flash('error', "User not found");
            res.redirect('/home');
        }
    }
});

router.post('/findUser', auth, async (req, res) => {
    const user = await db.findOne('users', { login: req.body.user, firstConnection: false });
    if (user) {
        res.redirect('/profile/user/' + req.body.user);
    }
    else {
        req.flash('error', "User not found");
        res.redirect('/home');
    }
})

router.get('/addLike/:login', auth, async (req, res) => {
    if (req.session.login === req.params.login)
        res.redirect("/myaccount");
    else {
        try {
            await User.addLike(req.params.login, req.session.login);
            res.redirect('/profile/user/' + req.params.login);                
        } catch(e) {
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
            await User.removeLike(req.params.login, req.session.login);
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
        const user = await db.findOne('users', { login: req.params.login });
        if (user) {
            let liker = req.session.login;
            let like = req.params.login;
            let blocker = [req.session.login];
            await db.updateOne('users', { login: req.params.login }, { $addToSet: { blocker: { $each: blocker }}});
            await db.updateOne('users', { login: req.session.login }, { $pull: { like: like }});
            await db.updateOne('users', { login: req.params.login }, { $pull: { liker: liker }});
            // req.session.success.push({msg: "Your alert was took in concern, thanks"});
            res.redirect('/home');
        }
        else {
            req.flash('error', "User not found");
            res.redirect('/home');
        }
        }
        catch (e) {
            console.log(e);
        }
    }
})

module.exports = router;