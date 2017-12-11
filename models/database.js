const mongo = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;
const assert = require('assert');

const url = 'mongodb://localhost:27017/matchadb';

const connectToDatabase = () => {
    return new Promise((res, rej) => {
        mongo.connect(url, (err, db) => {
            if (err){
                rej(err);
            } else {
                res(db);
            }
        });
    });
};

const getData = (collection, condition) => {
	return new Promise((resolve, reject) => {
        let resultArray = [];
        mongo.connect(url, (err, db) => {
			if (assert.equal(null, err))
				resolve("Error from database connection");
			let cursor = db.collection(collection).find(condition);
			cursor.forEach((doc, err) => {
				if (assert.equal(null, err))
					resolve("Error from get data");
				resultArray.push(doc);
			}, () => {
				db.close();
				(resultArray.length) ? resolve(resultArray) : resolve("No data");
			});
		});
	});
};

const getDataSorted = (collection, condition, sort) => {
	return new Promise((resolve, reject) => {
        let resultArray = [];
        mongo.connect(url, (err, db) => {
			if (assert.equal(null, err))
				resolve("Error from database connection");
			let cursor = db.collection(collection).find(condition).sort(sort);
			cursor.forEach((doc, err) => {
				if (assert.equal(null, err))
					resolve("Error from get data");
				resultArray.push(doc);
			}, () => {
				db.close();
				(resultArray.length) ? resolve(resultArray) : resolve("No data");
			});
		});
	});
};

const insertData = (collection, item) => {
	mongo.connect(url, (err, db) => {
		assert.equal(null, err);
		db.collection(collection).insertOne(item, (err, result) => {
			assert.equal(null, err);
			db.close();
		});
	});
};

const updateData = (collection, field, item) => {
	return new Promise((resolve, reject) => {
		mongo.connect(url, (err, db) => {
			if (assert.equal(null, err))
				reject ("error");
			db.collection(collection).update(field, item, (err, result) => {
				if (assert.equal(null, err))
					reject ("error");
				db.close();
			});
		});
		resolve("OK");
	})
};

module.exports = {
    'connectToDatabase': connectToDatabase,
	'getData': getData,
	'getDataSorted': getDataSorted,
	'updateData': updateData,
	'insertData': insertData
};
