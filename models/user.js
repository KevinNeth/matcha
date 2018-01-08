const db = require('./db');
const notify = require('../controllers/notifications');

class User {
    constructor(info) {
        Object.assign(this, info);
        this.scorePoints = {
            like: 5,
            unlike: -5,
            view: 1
        };
    }

    // lookup methods
    static async find(condition) {
        try {
            let info = await db.findOne('users', condition);
            if (!info)
                throw new Error('No user found.');
            return new User(info);
        } catch (e) {
            throw new Error('No user found.');
        }
    }

    static async get(login) {
        return User.find({ login: login });
    }

    async lookup(target) {
        return User.find({
            login: target,
            firstConnection: false,
            blockedBy: { $ne: this.login }
        });
    }

    // update methods
    async update(info) {
        try {
            let result = await db.findOneAndUpdate('users', { login: this.login }, info);
            Object.assign(this, result.value);
        } catch (e) {
            console.log("Error updating user: " + e);
        }
    }

    async set(property, value) {
        await this.update({ $set: { [property]: value } });
    }

    // interaction info methods
    hasLiked(target) {
        return (this.liked && Array.isArray(this.liked) && this.liked.includes(target));
    }

    isLikedBy(target) {
        return (this.likedBy && Array.isArray(this.likedBy) && this.likedBy.includes(target));
    }

    hasBlocked(target) {
        return (this.blocked && Array.isArray(this.blocked) && this.blocked.includes(target));        
    }

    isBlockedBy(target) {
        return (this.blockedBy && Array.isArray(this.blockedBy) && this.blockedBy.includes(target));        
    }

    matchedWith(target) {
        return (this.hasLiked(target) && this.isLikedBy(target));
    }

    wasViewedBy(target) {
        return (this.viewedBy && Array.isArray(this.viewedBy) && this.viewedBy.includes(target));
    }

    // user action methods
    async comesOnline() {
        this.update({ $set: {
            online: true,
            lastConnection: new Date()
        }});
    }

    async goesOffline() {
        this.update({ $set: {
            online: true,
            lastConnection: new Date()
        }});
    }

    async like(to) {
        if (!(this.hasLiked(to))) {        
            try {
                let target = await this.lookup(to),
                    type = target.hasLiked(this.login) ? 'mutual' : 'like';
                    
                if (!(target.hasBlocked(this.login)))
                    notify(type, target.login, this.login);

                target.update({ $addToSet: { likedBy: this.login }, ...target.setScore('like') });
                await this.update({ $addToSet: { liked: target.login}});
            } catch (e) { console.log(e); }
        }
    }

    async unlike(to) {
        if (this.hasLiked(to)) {        
            try {
                let target = await this.lookup(to);

                if (target.hasLiked(this.login) && !(target.hasBlocked(this.login)))
                    notify('unlike', target.login, this.login);

                target.update({ $pull: { likedBy: this.login }, ...target.setScore('unlike') });
                await this.update({ $pull: {liked: target.login }});
            } catch (e) { console.log(e); }
        }
    }

    async block(to) {
        if (!(this.hasBlocked(to))) {
            try {
                let target = await this.lookup(to);

                target.update({ $addToSet: { blockedBy: this.login }});
                await this.update({ $addToSet: { blocked: target.login } });
            } catch (e) { console.log(e); }
        }
    }

    async view(to) {
        try {
            let target = await this.lookup(to);
            if (!(target.wasViewedBy(this.login))) {
                if (!(target.hasBlocked(this.login)))
                    notify('view', target.login, this.login);
                target.update({ $addToSet: { viewedBy: this.login }, ...target.setScore('view') });                
            }
            return target;
        } catch (e) { throw e; }
    }

    // utility methods
    get age() {
        let diff = Date.now() - this.birthday.getTime();
        let age = new Date(diff);
        return Math.abs(age.getUTCFullYear() - 1970);
    }

    setScore(action) {
        let oldScore = this.score || 0;
        return { $set: { score: ( oldScore + this.scorePoints[action])}};
    }
}

module.exports = User;