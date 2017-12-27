const Notification = require('../models/notification');

module.exports = async (type, to, from, data = {}) => {
    try {
        io.to(to).emit('notification');
        io.to(to).emit(type, from, data);
        await Notification.add(type, to, from);
    } catch(e) {
        console.log("Notification error: " + e);
    }
};