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
online = (username, socket) => {
    return db.setField('users', {
        username: username
    }, 'online', socket);
};

//when user disconnects from socket.io
offline = (socket) => {
    return db.setField('users', {
        online: socket
    }, 'online', false);
};

module.exports = {
    get, find, online, offline
};