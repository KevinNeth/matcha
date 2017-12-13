module.exports = (io) => {
    const Conversation = require('../models/conversation');
    let online = [];

    io.on('connection', (socket) => {
        let from = socket.handshake.session.login,
            to = socket.handshake.query.to;

        if (from && to /* && User.isMatch(from, to) */) {
            socket.join(from);
            online.push(from);
        } else {
            socket.emit('auth-error', "Unable to message this user.");
            socket.disconnect('Unauthorized');
        }

        socket.on('message-send', async (message) => {
            try {
                await Conversation.addMessage(to, from, message);
                io.to(from).emit('message-sent', message);
                if (online.includes(to))
                    io.to(to).emit('message-received', message);
                console.log(message);
            } catch(e) {
                console.log(e);
            }
        });

        socket.on('disconnect', () => {
            online.splice(online.indexOf(from), 1);
            console.log(online);
        });

        console.log(online);
    });
}