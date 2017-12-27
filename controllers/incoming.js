const Conversation = require('../models/conversation');
const User = require('../models/user');
const notify = require('./notifications.js');

io.on('connection', async (socket) => {
    try {
        let user = await User.get(socket.handshake.session.login),
            login = user.login;

        if (user) {
            socket.join(login);        
            await user.comesOnline();
        } else {
            console.log("Unauthorized connection attempt.");
            socket.disconnect('Unauthorized');
        }

        socket.on('disconnect', () => {
            io.of('/').in(login).clients(async function (err, clients) {
                if (clients.length < 1) {
                    await user.goesOffline();
                }
            });
        });

        socket.on('message-send', async (data) => {
            if (login) {
                let to = data.to,
                    message = {
                        author: login,
                        time: new Date(),
                        text: data.text
                    };

                if (to && message.text && message.text !== "") {
                    await Promise.all([
                        Conversation.addMessage(to, login, message),
                        notify('message', data.to, login, message.text)
                    ]);
                    io.to(login).emit('message-sent', message.text);
                }
            }
        });
    } catch (e) {
        socket.disconnect('Unauthorized');
    }
});