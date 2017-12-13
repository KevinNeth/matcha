const db = require('./db');

/* {
    online: [socket ID if online || false if offline]
} */

get = async (login) => {
    let user = await db.findOne('users', { login: login });
    if (!user)
        throw new Error('No user found.');
    return user;
};

find = async (condition) => {
    let user = await db.findOne('users', condition);
    if (!user)
        throw new Error('No user found.');
    return user;
};

// when user connects with socket.io
comesOnline = async (login) => {
    try {
        await db.updateOne('users', {
            login: login
        }, { $set: { online: true }});
    } catch(e) {
        console.log(e);
    }
};

//when user disconnects from socket.io
goesOffline = async (login) => {
    try {
        await db.updateOne('users', {
            login: login
        }, { $set: { online: false }});
    } catch(e) {
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

module.exports = {
    get, find, comesOnline, goesOffline, isOnline
};