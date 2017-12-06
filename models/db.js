const mongo = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;
const options = require('../config/db');


connect = function() {
    return new Promise((resolve, reject) => {
        let mongoUri = 'mongodb://' + options.host + ':' + options.port + '/' + options.dbName;
        mongo.connect(mongoUri, (err, db) => {
            if (err) reject(err);
            else resolve(db);
        });
    });
};

prepare = function(collectionName) {
    return new Promise((resolve, reject) => {
        connect()
        .then((db) => {
            resolve(db.collection(collectionName));
        })
        .catch((err) => {
            reject(err);
        });
    });
}

insertMany = function(collectionName, docs) {
    return new Promise((resolve, reject) => {
        prepare(collectionName)
        .then((collection) => {
            collection.insertMany(docs, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        })
        .catch((err) => {
            reject(err);
        });
    });
}

insertOne = function(collectionName, doc) {
    return new Promise((resolve, reject) => {
        prepare(collectionName)
        .then((collection) => {
            collection.insertOne(doc, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        })
        .catch((err) => {
            reject(err);
        });
    });
}

updateMany = function(collectionName, condition, update) {
    return new Promise((resolve, reject) => {
        prepare(collectionName)
        .then((collection) => {
            collection.updateMany(condition, update, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        })
        .catch((err) => {
            reject(err);
        });
    });
}

updateOne = function (collectionName, condition, update) {
    return new Promise((resolve, reject) => {
        prepare(collectionName)
        .then((collection) => {
            collection.updateOne(condition, update, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        })
        .catch((err) => {
            reject(err);
        });
    });
}

setField = function (collectionName, condition, field, value) {
    return updateOne(collectionName, condition, { $set: { field: value } })
}

deleteMany = function (collectionName, condition) {
    return new Promise((resolve, reject) => {
        prepare(collectionName)
        .then((collection) => {
            collection.deleteMany(condition, update, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        })
        .catch((err) => {
            reject(err);
        });
    });
}

deleteOne = function (collectionName, condition) {
    return new Promise((resolve, reject) => {
        prepare(collectionName)
        .then((collection) => {
            collection.deleteOne(condition, update, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        })
        .catch((err) => {
            reject(err);
        });
    });
}

find = function(collectionName, condition) {
    return new Promise((resolve, reject) => {
        prepare(collectionName)
        .then((collection) => {
            collection.find(condition).toArray((err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        })
        .catch((err) => {
            reject(err);
        });
    });
}

findOne = function (collectionName, condition) {
    return new Promise((resolve, reject) => {
        prepare(collectionName)
        .then((collection) => {
            collection.findOne(condition, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        })
        .catch((err) => {
            reject(err);
        });
    });
}

findOneById = function (collectionName, id) {
    return new Promise((resolve, reject) => {
        prepare(collectionName)
            .then((collection) => {
                collection.findOne({ _id: objectId(id) }, (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                });
            })
            .catch((err) => {
                reject(err);
            });
    });
}

findOneAndUpdate = function (collectionName, condition, update) {
    return new Promise((resolve, reject) => {
        prepare(collectionName)
        .then((collection) => {
            collection.findOneAndUpdate(condition, update, { returnNewDocument: true }, (err, doc) => {
                if (err) reject(err);
                else resolve(doc);
            });
        })
        .catch((err) => {
            reject(err);
        });
    });
}

findOneProjection = function (collectionName, condition, projection) {
    return new Promise((resolve, reject) => {
        prepare(collectionName)
            .then((collection) => {
                collection.findOne(condition, projection, (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                });
            })
            .catch((err) => {
                reject(err);
            });
    });
}

findSort = function (collectionName, findCondition, sortCondition) {
    return new Promise((resolve, reject) => {
        prepare(collectionName)
            .then((collection) => {
                collection.find(findCondition).sort(sortCondition).toArray((err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                });
            })
            .catch((err) => {
                reject(err);
            });
    });
}


module.exports = {
    connect, prepare, objectId, insertMany, insertOne, updateMany, updateOne, find, findOne, findOneAndUpdate, findOneById, findOneProjection
};