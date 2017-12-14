const Notification = require('../models/notification');

module.exports = async (type, to, from, data = {}) => {
    io.to(to).emit('notification');    
    io.to(to).emit(type, from, data);
    await Notification.add(type, to, from);
};