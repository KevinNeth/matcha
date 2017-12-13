const Notification = require('../models/notification');

module.exports = async (type, to, from, data = {}) => {
    userLink= (login) => {
        return '<a href="/profile/' + login + '">' + login + '</a>';
    };

    console.log(type, from, data);

    io.to(to).emit(type, from, data);
    await Notification.add(type, to, from);
};