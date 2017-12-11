const mongo = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;
const options = require('../config/db');

/* Usage:
const User = await db.prepare('users'); */

connect = () => {
    let mongoUri = 'mongodb://' + options.user + ':' + options.pwd + '@' + options.host + ':' + options.port + '/' + options.dbName;
    console.log(mongoUri);
    return mongo.connect(mongoUri);
};

// prepare = (collectionName) => {
//     return new Promise((resolve, reject) => {
//         connect()
//         .catch((err) => {
//             reject(err);
//         })
//         .then((db) => {
//             resolve(db.collection(collectionName));
//         })
//         .catch((err) => {
//             reject(err);            
//         });
//     });
// };

prepare = async (collectionName) => {
    let db = await connect();
    return (db.collection(collectionName));
};

insertMany = (collectionName, docs) => {
    return new Promise((resolve, reject) => {
        prepare(collectionName)
        .then((collection) => {
            return collection.insertMany(docs);
        })
        .catch((err) => {
            reject(err);
        });
    });
}

insertOne = (collectionName, doc) => {
    return new Promise((resolve, reject) => {
        prepare(collectionName)
        .then((collection) => {
            return collection.insertOne(doc);
        })
        .catch((err) => {
            reject(err);
        });
    });
}

updateMany = (collectionName, condition, update) => {
    return new Promise((resolve, reject) => {
        prepare(collectionName)
        .then((collection) => {
            return collection.updateMany(condition, update);
        })
        .catch((err) => {
            reject(err);
        });
    });
}

updateOne = (collectionName, condition, update) => {
    return new Promise((resolve, reject) => {
        prepare(collectionName)
        .then((collection) => {
            return collection.updateOne(condition, update);
        })
        .catch((err) => {
            reject(err);
        });
    });
}

setField = (collectionName, condition, field, value) => {
    return updateOne(collectionName, condition, { $set: { field: value } });
}

deleteMany = (collectionName, condition) => {
    return new Promise((resolve, reject) => {
        prepare(collectionName)
        .then((collection) => {
            return collection.deleteMany(condition, update);
        })
        .catch((err) => {
            reject(err);
        });
    });
}

deleteOne = (collectionName, condition) => {
    return new Promise((resolve, reject) => {
        prepare(collectionName)
        .then((collection) => {
            return collection.deleteOne(condition, update);
        })
        .catch((err) => {
            reject(err);
        });
    });
}

find = (collectionName, condition) => {
    return new Promise((resolve, reject) => {
        prepare(collectionName)
        .then((collection) => {
            return collection.find(condition).toArray();
        })
        .catch((err) => {
            reject(err);
        });
    });
}

findOne = (collectionName, condition) => {
    return new Promise((resolve, reject) => {
        prepare(collectionName)
        .then((collection) => {
            return collection.findOne(condition);
        })
        .catch((err) => {
            reject(err);
        });
    });
}

findOneById = (collectionName, id) => {
    return new Promise((resolve, reject) => {
        prepare(collectionName)
            .then((collection) => {
                return collection.findOne({ _id: objectId(id) });
            })
            .catch((err) => {
                reject(err);
            });
    });
}

findOneAndUpdate = (collectionName, condition, update) => {
    return new Promise((resolve, reject) => {
        prepare(collectionName)
        .then((collection) => {
            return collection.findOneAndUpdate(condition, update, { returnNewDocument: true });
        })
        .catch((err) => {
            reject(err);
        });
    });
}

findOneProjection = (collectionName, condition, projection) => {
    return new Promise((resolve, reject) => {
        prepare(collectionName)
            .then((collection) => {
                return collection.findOne(condition, projection);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

findSort = (collectionName, findCondition, sortCondition) => {
    return new Promise((resolve, reject) => {
        prepare(collectionName)
            .then((collection) => {
                return collection.find(findCondition).sort(sortCondition).toArray();
            })
            .catch((err) => {
                reject(err);
            });
    });
}


module.exports = {
    connect, prepare, objectId, insertMany, insertOne, updateMany, updateOne, find, findOne, findOneAndUpdate, findOneById, findOneProjection
};