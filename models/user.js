const db = require('./db');

/* {
    online: [socket ID if online || false if offline]
} */

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
    online, offline
};