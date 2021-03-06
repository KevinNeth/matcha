const mongo = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;
const options = require('../config/db');

/* Usage:
const User = await db.prepare('users');
*/

connect = async () => {
    let mongoUri = 'mongodb://' + options.user + ':' + options.pwd + '@' + options.host + ':' + options.port + '/' + options.dbName;
    return mongo.connect(mongoUri);
};

prepare = async (collectionName) => {
    let db = await connect();
    return (db.collection(collectionName));
};

insertMany = async (collectionName, docs) => {
    let collection = await prepare(collectionName);
    return collection.insertMany(docs);
}

insertOne = async (collectionName, doc) => {
    let collection = await prepare(collectionName);
    return collection.insertOne(doc);
}

updateMany = async (collectionName, condition, update) => {
    let collection = await prepare(collectionName);
    return collection.updateMany(condition, update);
}

updateOne = async (collectionName, condition, update, options = {}) => {
    let collection = await prepare(collectionName);
    return collection.updateOne(condition, update, options);
}

deleteMany = async (collectionName, condition) => {
    let collection = await prepare(collectionName);
    return collection.deleteMany(condition, update);
}

deleteOne = async (collectionName, condition) => {
    let collection = await prepare(collectionName);
    return collection.deleteOne(condition, update);
}

find = async (collectionName, condition) => {
    let collection = await prepare(collectionName);
    return collection.find(condition).toArray();
}

findOne = async (collectionName, condition, projection = {}) => {
    let collection = await prepare(collectionName);
    return collection.findOne(condition, projection);
}

findOneById = async (collectionName, id) => {
    let collection = await prepare(collectionName);
    return collection.findOne({ _id: objectId(id) });
}

findOneAndUpdate = async (collectionName, condition, update) => {
    let collection = await prepare(collectionName);
    return collection.findOneAndUpdate(condition, update, { returnOriginal: false });
}

findSort = async (collectionName, findCondition, sortCondition) => {
    let collection = await prepare(collectionName);
    return collection.find(findCondition).sort(sortCondition).toArray();
}

count = async (collectionName, condition) => {
    let collection = await prepare(collectionName);
    return collection.count(condition);
}

max = async (collectionName, field) => {
    try {
        let collection = await prepare(collectionName);
        let docs = await collection.find().sort({ [field]: -1 }).limit(1).toArray();
        if (docs[0])
            return docs[0][field];
        else
            return 0;
    } catch(e) {
        console.log(e);
        return 0;
    }
}

module.exports = {
    connect, prepare, objectId, insertMany, insertOne, updateMany, updateOne, find, findOne, findOneAndUpdate, findOneById, findSort, count, max
};