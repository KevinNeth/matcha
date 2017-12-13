const db = require('./db');

/* {
    to: [username],
    from: [username],
    timestamp: [datetime],
    message: [text]
} */

criteria = (user1, user2) => {
    return ({
        $or: [
            { user1: user1, user2: user2 },
            { user1: user2, user2: user1 }
        ]
    });
};

addMessage = async (to, from, message) => {
    try {
        await db.updateOne('conversations', criteria(to, from), {
            $push: { messages: message },
            $setOnInsert: { user1: to, user2: from }
        }, { upsert: true });
        return message;
    } catch(e) {
        console.log(e);
        return false;
    }
};

get = async (user1, user2) => {
    try {
        let conversation = await db.findOne('conversations', criteria(user1, user2));
        if (conversation && conversation.messages)
            return conversation.messages;
        else
            return [];
    } catch (e) {
        return [];
    }
};

module.exports = {
    addMessage, get
};