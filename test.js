const db = require('./models/db.js');
const User = require('./models/user.js');

(async () => {
    try {
        let user = await User.find({ login: "lol", firstConnection: "yes" });		
        console.log('yep');	
        console.log(user);
    } catch (e) {
        console.log(e);
    }
})();
