const db = require('./db');

/* {
    to: [username],
    from: [username],
    timestamp: [datetime],
    message: [text]
} */

add = (to, from, message) => {
    return db.insertOne('messages', {
        to: to,
        from: from,
        time: new Date(),
        message: message
    });
};

getConversation = (user1, user2) => {
    return db.findSort('messages', {
        $or: [
            {from: user1, to: user2},
            {from: user2, to: user1}
        ]
    }, { timestamp: 1 });
};

module.exports = {
    add, getConversation
};