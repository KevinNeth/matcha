const db = require('../models/db');
const User = require('../models/user');

class SearchHelper {
    constructor(user) {
        this.user = user,
        this.query = {
            login: { $ne: this.user.login },
            firstConnection: false,
            orientation: { $in: [this.user.gender, "both"] },
            blocker: { $ne: this.user.login },
            gender: ((this.user.orientation === "both") ? { $in: ["woman", "man"] } : this.user.orientation )
        },
        this.sort = {}
    };

    async results() {
        try {
            if (this.sort instanceof Function) {
                let results = await db.find('users', this.query);
                return this.sort(results);           
            } else {
                let results = await db.findSort('users', this.query, this.sort);  
                return results;                              
            }
        } catch(e) {
            console.log("Search error: " + e);
            return [];
        }
    }

    //custom query filters
    filterAge(min, max) {
        Object.assign(this.query, { birthday: this.between(this.yearsOld(max), this.yearsOld(min)) });
    };

    filterScore(min, max) {
        Object.assign(this.query, { score: this.between(min, max) });
    };

    filterTags(interests) {
        Object.assign(this.query, { interest: { $all: interests }});
    };

    filterDistance(max) {
        if (this.user.location) {
            console.log(this.user.location);
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

    sortAge(order = 1) {
        this.sort = { birthday: (order * -1) }
    }

    sortScore(order = 1) {
        this.sort = { score: order };        
    }

    sortLocation() {
        if (!this.query.location) {
            Object.assign(this.query, {
                location: {
                    $nearSphere: {
                        $geometry: this.user.location
                    }
                }
            });
        }
    }

    sortInterests() {
        this.sort = function(results) {
            let sorter = (a, b) => b.common - a.common;
            let tags = this.user.interest || [];
            for (let i = 0; i < results.length; i++) {
                results[i]['common'] = (results[i]['interest']) ? ((Array.from(results[i]['interest'])).filter((tag) => tags.includes(tag)).length) : 0;
            }
            results.sort(sorter);
            return results;
        };
    }

    //utility functions
    between(min, max) {
        if (min && max)
            return { $gte: min, $lte: max };
        else if (min)
            return { $gte: min };
        else if (max)
            return { $lte: max };
        else
            return {};
    };

    yearsOld(years) {
        let date = new Date();
        date.setFullYear(date.getFullYear() - years);
        return date;
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
    }
}

module.exports = SearchHelper;