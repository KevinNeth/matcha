const db = require('./models/db.js');
const User = require('./models/user.js');
const Conversation = require('./models/conversation.js');
const SearchHelper = require('./controllers/searchHelper');

function light(e) {
    console.log(e);
}

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
//         let bitches = [];
//         let users = await db.prepare('users');
//         // let results = await users.aggregate([
//         //     { $project: { "interest": 1, common: {$setIntersection: ["$interest", ['lol', 'lolz']] }}}
//         // ]).toArray();

//         let tagz = ['42', 'COOKIES'];

//         // let results = await users.aggregate([
//         //     { $unwind: "$interest" },
//         //     { $match: { interest: {$in: tags }}},
//         //     { $group: { "_id": "$_id", "common": { $sum: 1 } } },
//         //     { $sort: { common: -1 } },
//         //     { $project: {"common": 1} }
//         // ]).toArray();

//         // let results = await users.aggregate([
//         //     // { $project: {"_id": 1, "common": {$setIntersection: ['$interest', tags] }}}
//         //     // { $count: { $match: { interest: { $in: tags}}}}
//         //     { $unwind: "$interest" },
//         //     { $match: { interest: { $in: tags } } },
//         //     { $group: { _id: "$_id", "common": { $push: '$interest' } } },
//         //     { $project: { _id: 1, common: 1}}
//         // ]).toArray();

//         // let results = await users.aggregate([
//         //     { $project: { 
//         //         _id: 1,
//         //         common: {
//         //             $size: {
//         //                 $filter: {
//         //                     input: "$interest",
//         //                     as: "tags",
//         //                     cond: { $in: ["$$tags", tagz]}
//         //                 }
//         //             }
//         //         }
//         //     }}
//         // ]).toArray();
//         sortCommon = (a, b) => b.common - a.common;
// // 
//         let match = [];
//         let results = await db.find('users', {});
//         for (i = 0; i < results.length; i++) {
//             results[i]['common'] = (results[i]['interest']) ? ((Array.from(results[i]['interest'])).filter((tag) => match.includes(tag)).length) : 0;
//         }
//         results.sort(sortCommon);
//         // let results = await users.find({}, { $project: { common: {$size: { $setIntersection: [["lol"], ['lol']]}}}}).toArray();
//         console.log(results);
        // let name = '';
        // let user = await User.get(req.session.login);
        // let search = new SearchHelper(user);
        // search.filterScore(undefined, 100);
        // console.log(search.query);
        // let results = await search.results();
        // console.log(results);
        // search.sortInterests();
        // let results = await search.results();
        // console.log(results);
        // let maxi = await db.max('users', 'shit');
        // console.log(maxi);
        // let user1 = await User.get('womanman1');
        // let user2 = await User.get('nlowe');

        // user1.like('nlowe');
        // user2.like('womanman1');
        // // let search = await user.lookup('womanman1');
        // // await user.like('womanman3');
        // user.update({"$$set": "$$why"});
        // console.log("test");
        // // user.set('lolz', 'no');
        // // console.log(user.setScore('like'));
        // // await user.update({$set: {orientation: "man"}});
        // console.log(user);
        // let user = await User.get('nlowe');
        // let target = await user.view('womanman1');
        // console.log(target);
        // console.log(user;
        let user = await User.get('nlowe');
        let search = new SearchHelper(user);
        search.filterName('lisa tran');
        console.log(search.query);
        let results = await search.results();
        console.log(results);
    } catch(e) {
        console.log(e);
    }
})();