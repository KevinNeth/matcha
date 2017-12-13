const db = require('./db');

/*
types: message, like, visit
*/

add = async (type, to, from, data = {}) => {
    let notification = {
        type: type,
        to: to,
        from: from,
        data: data,
        unread: true,
        time: new Date()
    };
    try{
        await db.insertOne('notifications', notification);
        return notification;
    } catch(e) {
        console.log(e);
        return false;
    }
};

getAll = async (login) => {
    try {
        let notifications = await db.findSort('notifications', { to: login }, { time: -1 });
        if (!notifications)
            return [];
        else
            return notifications;
    } catch(e) {
        console.log(e);
        return [];
    }
};

markAllRead = async (login) => {
    try {
        await db.updateMany('notifications', { to: login, unread: true }, {$set: { unread: false }});
    } catch(e) {
        console.log(e);
    }
};

unreadCount = async (login) => {
    try {
        let count = db.count('notifications', { to: login, unread: true });
        if (!count)
            return 0;
        else
            return count;
    } catch(e) {
        console.log(e);
        return 0;
    }
};

module.exports = {
    add, getAll, markAllRead, unreadCount
};