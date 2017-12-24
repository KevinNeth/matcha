const db = require('./db');
const notify = require('../controllers/notifications');

/* {
    online: [socket ID if online || false if offline]
} */

get = async (login) => {
    let user = await db.findOne('users', { login: login });
    if (!user)
        throw new Error('No user found.');
    return user;
};

lookup = async (login, searcher) => {
    let user = await db.findOne('users', {
        login: login,
        firstConnection: false,
        blocker: { $ne: this.searcher },
    });
    if (!user)
        throw new Error('No user found.');
    return user;
};

age = (birthday) => {
    let diff = Date.now() - birthday.getTime();
    let age = new Date(diff);
    return Math.abs(age.getUTCFullYear() - 1970);
};

// when user connects with socket.io
comesOnline = async (login) => {
    try {
        await db.updateOne('users', {
            login: login
        }, { $set: { online: true } });
    } catch (e) {
        console.log(e);
    }
};

//when user disconnects from socket.io
goesOffline = async (login) => {
    try {
        await db.updateOne('users', {
            login: login
        }, { $set: { online: false } });
    } catch (e) {
        console.log(e);
    }
};

isOnline = async (login) => {
    try {
        let user = await module.exports.get(login);
        if (user.online)
            return user.online;
        else
            return false;
    } catch (e) {
        console.log(e);
        return false;
    }
};

isBlocked = (blocked, blockedBy) => {
    if (blocked.blocker && blocked.blocker.includes(blockedBy)) {
        return true;
    } else {
        return false;
    }
};

isLiked = (liked, likedBy) => {
    if (liked.liker && liked.liker.includes(likedBy)) {
        return true;
    } else {
        return false;
    }
};

scorePoints = {
    like: 5,
    unlike: -5,
    view: 1
};

newScore = (user, action) => {
    let oldScore = user.score || 0;
    return { score: (oldScore + scorePoints[action]) };
};

addLike = async (to, from) => {
    try {
        let target = await module.exports.lookup(to, from),
            type = (target.like && Array.isArray(target.like) && target.like.includes(from)) ? 'mutual' : 'like';

        if (!(target.liker && Array.isArray(target.liker) && target.liker.includes(from))) {
            await Promise.all([
                db.updateOne('users', { login: from }, { $addToSet: { like: to } }),
                db.updateOne('users', { login: to }, { $addToSet: { liker: from }, $set: newScore(target, 'like') }),
                notify(type, to, from)
            ]);
        }
    } catch (e) { throw e }
};

removeLike = async (to, from) => {
    try {
        let target = await module.exports.lookup(to, from);
        if (target.liker && Array.isArray(target.liker) && target.liker.includes(from)) {
            console.log("here");
            if (target.like && Array.isArray(target.like) && target.like.includes(from)) {
                await notify('unlike', to, from);
            }
            await Promise.all([
                db.updateOne('users', { login: from }, { $pull: { like: to } }),
                db.updateOne('users', { login: to }, { $pull: { liker: from }, $set: newScore(target, 'unlike') })
            ]);
        }
    } catch (e) { console.log(e); }
};

view = async (to, from) => {
    try {
        let target = await module.exports.lookup(to, from);
        await Promise.all([
            db.updateOne('users', { login: to }, { $addToSet: { viewers: from }, $set: newScore(target, 'view') }),
            notify('view', to, from)
        ]);
    } catch (e) { console.log(e); }
};

module.exports = {
    get, find, comesOnline, goesOffline, isOnline, addLike, removeLike, view, isBlocked, isLiked, age
};