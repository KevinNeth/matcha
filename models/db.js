const mongo = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;
const options = require('../config/db');

/* Usage:
const User = await db.prepare('users'); */

connect = async () => {
    let mongoUri = 'mongodb://' + options.user + ':' + options.pwd + '@' + options.host + ':' + options.port + '/' + options.dbName;
    console.log(mongoUri);
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

updateOne = async (collectionName, condition, update) => {
    let collection = await prepare(collectionName);
    return collection.updateOne(condition, update);
}

setField = async (collectionName, condition, field, value) => {
    let collection = await prepare(collectionName);
    return collection.updateOne(collectionName, condition, { $set: { field: value } });
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

findOne = async (collectionName, condition) => {
    let collection = await prepare(collectionName);
    return collection.findOne(condition);
}

findOneById = async (collectionName, id) => {
    let collection = await prepare(collectionName);
    return collection.findOne({ _id: objectId(id) });
}

findOneAndUpdate = async (collectionName, condition, update) => {
    let collection = await prepare(collectionName);
    return collection.findOneAndUpdate(condition, update, { returnNewDocument: true });
}

findOneProjection = async (collectionName, condition, projection) => {
    let collection = await prepare(collectionName);
    return collection.findOne(condition, projection);
}

findSort = async (collectionName, findCondition, sortCondition) => {
    let collection = await prepare(collectionName);
    return collection.find(findCondition).sort(sortCondition).toArray();
}

module.exports = {
    connect, prepare, objectId, insertMany, insertOne, updateMany, updateOne, find, findOne, findOneAndUpdate, findOneById, findOneProjection
};