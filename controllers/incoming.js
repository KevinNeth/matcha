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
            let to = data.to,
                message = {
                    author: login,
                    time: new Date(),
                    text: data.text
                };

            if (to && message.text && message.text !== "") {
                console.log("ready to send");
                Promise.all([ Conversation.addMessage(to, login, message),
                    notify('message', data.to, login, message.text) ])
                .then(() => {
                    io.to(login).emit('message-sent', message.text);
                });
            }
        }
    });
});