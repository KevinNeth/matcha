const Notification = require('../models/notification');

module.exports = async (type, to, from, data = {}) => {
    let notification = await Notification.add(type, to, from, data);
    if (notification)
        io.to(to).emit(notification);
};