const db = require('../models/db');
const User = require('../models/user');

class SearchHelper {
    constructor(user) {
        this.user = user;
        this.query = {
            login: { $ne: this.user.login },
            firstConnection: false,
            orientation: { $in: [this.user.gender, "both"] },
            blockedBy: { $ne: this.user.login },
            gender: ((this.user.orientation === "both") ? { $in: ["woman", "man"] } : this.user.orientation )
        };
        this.sortOption = {};
    };

    async results() {
        try {
            if (this.sortOption instanceof Function) {
                let results = await db.find('users', this.query);
                return this.sortOption(results);
            } else {
                let results = await db.findSort('users', this.query, this.sortOption);  
                return results;
            }
        } catch(e) {
            console.log("Search error: " + e);
            return [];
        }
    };

    sort(option) {
        let sortOptions = {
            age: this.sortAge,
            score: this.sortScore,
            distance: this.sortLocation,
            interest: this.sortInterests
        };
        if (option && sortOptions[option])
            (sortOptions[option]).call(this);
    };
    
    //custom query filters
    filterAge(min, max) {
        if (this.notEmpty(min) || this.notEmpty(max))
            Object.assign(this.query, { birthday: this.between(this.yearsOld(max), this.yearsOld(min)) });
    };

    filterScore(min, max) {
        if (this.notEmpty(min) || this.notEmpty(max)) 
            Object.assign(this.query, { score: this.between(min, max) });
    };

    filterInterests(interests) {
        if (Array.isArray(interests) && interests.length > 0)
            Object.assign(this.query, { interest: { $all: interests }});
    };

    filterDistance(max) {
        if (max && this.notEmpty(max) && this.user.location) {
            Object.assign(this.query, {
                location: {
                    $nearSphere: {
                        $geometry: this.user.location,
                        $maxDistance: (max * 1000)
                    }
                }
            });
        }
    };

    sortAge() {
        this.sortOption = { birthday: -1 };
    };

    sortScore() {
        this.sortOption = { score: 1 };
    };

    sortLocation() {
        if (!this.query.location && this.user.location) {
            Object.assign(this.query, {
                location: {
                    $nearSphere: {
                        $geometry: this.user.location
                    }
                }
            });
        }
    };

    sortInterests() {
        this.sortOption = function(results) {
            let sorter = (a, b) => b.common - a.common;
            let tags = this.user.interest || [];
            for (let i = 0; i < results.length; i++) {
                results[i]['common'] = (results[i]['interest']) ? ((Array.from(results[i]['interest'])).filter((tag) => tags.includes(tag)).length) : 0;
            }
            results.sort(sorter);
            return results;
        };
    };

    //utility functions
    between(min, max) {
        if (this.notEmpty(min) && this.notEmpty(max))
            return { $gte: min, $lte: max };
        else if (this.notEmpty(min))
            return { $gte: min };
        else if (this.notEmpty(max))
            return { $lte: max };
        else
            return {};
    };

    yearsOld(years) {
        if (this.notEmpty(years)) {
            let date = new Date();
            date.setFullYear(date.getFullYear() - years);
            return date;
        } else {
            return null;
        }
    };

    notEmpty(value) {
        if (isNaN(value) || (!value && value !==0))
            return false;
        else
            return true;
    };

    //standard query helpers
    location() {
        if (this.user.location) {
            return {
                location: {
                    $nearSphere: {
                        $geometry: this.user.location
                    }
            }};
        } else {
            return {};
        }
    };
}



module.exports = SearchHelper;