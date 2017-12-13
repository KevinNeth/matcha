const Conversation = require('../models/conversation');
const User = require('../models/user');
const notify = require('./notifications.js');

io.on('connection', async (socket) => {
    let login = socket.handshake.session.login;
    console.log(login);

    if (login) {
        socket.join(login);        
        await User.comesOnline(login);
    } else {
        console.log("Unauthorized connection attempt.");
        socket.disconnect('Unauthorized');
    }

    socket.on('disconnect', () => {
        io.of('/').in(login).clients(async function (err, clients) {
            if (clients.length < 1) {
                await User.goesOffline(login);
            }
        });
    });

    socket.on('message-send', async (data) => {
        if (login) {
            let message = {
                author: login,
                time: new Date(),
                text: data.text
            };

            if (data.to && message.text && message.text !== "") {
                Promise.all([ Conversation.addMessage(data.to, login, message),
                    notify('message', data.to, login, message) ])
                .then(() => {
                    io.to(login).emit('message-sent', message.text);
                });
            }
        }
    });
});