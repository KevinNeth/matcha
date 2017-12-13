const db = require('./models/db.js');
const User = require('./models/user.js');
const Conversation = require('./models/conversation.js');

(async () => {
    // try {
    //     // Conversation.addMessage('lol3', 'lol4', 'YEA BABY!');
    //     let conversation = await Conversation.get('lol4', 'lol4');
    //     console.log(conversation);
    // } catch (e) {
    //     console.log(e);
    // }
    await User.comesOnline('nlowe', 69);
    // await User.goesOffline(69);
    // let user = await User.get('nlowe');
    if (await User.isOnline('nlowe'))
        console.log(await User.isOnline('nlowe'));
    else
        console.log("no");
    // console.log(user);
})();
