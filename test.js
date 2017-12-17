const db = require('./models/db.js');
const User = require('./models/user.js');
const Conversation = require('./models/conversation.js');
const SearchHelper = require('./controllers/searchHelper');

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
        // let user = await User.get('n8lowe');
        // search = new SearchHelper(user);
        // search.age(1);
        // search.filterScore(0, 100);
        // search.filterDistance(100);
        // search.sortLocation(1);
        // console.log(search.query);
        // let results = await search.results();
        // console.log(results);
        let bitches = [];
        let users = await db.prepare('users');
        let results = await users.aggregate([
            { $unwind: "$interest" },
            { $group: {"_id": "$_id", "common": {$sum: 1}}},
            { $sort: {common: -1} },
            { $project: {}}
        ]).toArray();
        let results = await users.find({}, { "common": {$size: { $setIntersection: ["$interests", ['lol']]}}}).toArray();
        console.log(results);
    } catch(e) {
        console.log(e);
    }
})();