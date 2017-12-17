const db = require('./models/db.js');
const User = require('./models/user.js');
const Conversation = require('./models/conversation.js');
const search = require('./controllers/search');

(async () => {
    // try {
    //     // Conversation.addMessage('lol3', 'lol4', 'YEA BABY!');
    //     let conversation = await Conversation.get('lol4', 'lol4');
    //     console.log(conversation);
    // } catch (e) {
    //     console.log(e);
    // }
    // await User.comesOnline('nlowe', 69);
    // // await User.goesOffline(69);
    // // let user = await User.get('nlowe');
    // if (await User.isOnline('nlowe'))
    //     console.log(await User.isOnline('nlowe'));
    // else
    //     console.log("no");
    // // console.log(user);
    // let list = await User.get('n8lowe');
    // console.log(list);
    // console.log(typeof datelol);
    // console.log(search.between(search.date(search.yearsOld(17)), search.date(search.yearsOld(40))));
    // console.log(search.betweenAge(18, 26));
    try {
        // await db.updateOne('users', { login: 'n8lowe' }, {$set: {$add: { score: 5 }}});
        // await User.addLike('n8lowe', 'natelowe');
        // let user = await User.get('n8lowe');
        let list = await User.find({ birthday: search.betweenAge(18, 30) });
        console.log(list);
    } catch(e) {
        console.log(e);
    }
})();

