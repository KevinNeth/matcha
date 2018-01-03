const Conversation = require('../models/conversation');
const User = require('../models/user');
const notify = require('./notifications.js');

io.on('connection', async (socket) => {
    try {
        let user = await User.get(socket.handshake.session.login),
            login = user.login;

        if (user) {
            socket.join(login);        
            user.comesOnline();
        } else {
            console.log("Unauthorized connection attempt.");
            socket.disconnect('Unauthorized');
        }

        socket.on('disconnect', () => {
            io.of('/').in(login).clients(async function (err, clients) {
                if (clients.length < 1)
                    user.goesOffline();
            });
        });

        socket.on('message-send', async (data) => {
            if (user) {
                let to = data.to,
                    message = {
                        author: login,
                        time: new Date(),
                        text: data.text
                    };

                if (to && message.text && message.text !== "") {
                    try {
                        await Conversation.addMessage(to, login, message);
                        if (!(user.isBlockedBy(to)))
                            notify('message', data.to, login, message.text);
                        io.to(login).emit('message-sent', message.text);
                    } catch(e) {
                        console.log("Message not sent: " + e);
                    }
                }
            }
        });
    } catch (e) {
        socket.disconnect('Unauthorized');
    }
});