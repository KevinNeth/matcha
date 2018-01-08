const Notification = require('../models/notification');
const escape = require('escape-html');

text = {
    message: ' sent you a message.',
    like: ' liked your profile.',
    view: ' visited your profile.',
    mutual: ' liked you back!',
    unlike: ' no longer likes you. Sorry.'
};

module.exports = async (type, to, from, data) => {
    try {
        if (type === 'message')
            io.to(to).emit('message', escape(from), escape(data));
        io.to(to).emit('notification', type, escape(from), text[type]);
        await Notification.add(type, to, from, text[type]);
    } catch(e) {
        console.log("Notification error: " + e);
    }
};