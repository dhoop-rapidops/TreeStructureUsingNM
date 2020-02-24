const mongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27018/';
const databaseName = "Bank";

module.exports = class Bank {

    constructor() {

    }

    static getInstance = () => {
        if (this.obj == undefined) {
            this.obj = new Bank();
            return this.obj;
        }
        return this.obj;
    }

    allData = () => {
        return new Promise((resolve, reject) => {
            mongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true }, (err, client) => {
                if (err) reject(err);
                const db = client.db(databaseName);
                db.collection("Demo").find({}, { projection: { _id: 0 } }).toArray((err, results) => {
                    if (err) return reject(err);
                    client.close();
                    return resolve(results);
                });
            });
        });
    }

    updateData = (updateQuery, value) => {
        return new Promise((resolve, reject) => {
            mongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true }, (err, client) => {
                if (err) return reject(err);
                const db = client.db(databaseName);

                db.collection("Demo").find({}, { projection: { _id: 0 } }).toArray((err, results) => {
                    if (err) return reject(err);

                    results.forEach((res) => {
                        if (updateQuery.split(".")[0] == Object.entries(res)[0][0]) {
                            let find = this.createfindQuery(res, updateQuery);
                            let update = {}; update[updateQuery] = value;
                            console.log("Find: ", find, "Update: ", update);
                            db.collection("Demo").updateOne(find, { $set: update }, (err, res) => {
                                if (err) console.log("Error: ", err.message);
                                resolve(1);
                            });
                        }
                    });
                });
            });
        });
    }

    insertData = (updateQuery, value) => {
        return new Promise((resolve, reject) => {
            mongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true }, (err, client) => {
                if (err) return reject(err);
                const db = client.db(databaseName);

                db.collection("Demo").find({}, { projection: { _id: 0 } }).toArray((err, results) => {
                    if (err) return reject(err);

                    let isExist = false;
                    results.forEach((res) => {
                        if (updateQuery.split(".")[0] == Object.entries(res)[0][0]) {
                            isExist = true;
                            let find = this.createfindQuery(res, updateQuery);
                            let update = {}; update[updateQuery] = value;
                            console.log("Find: ", find, "Update: ", update);
                            db.collection("Demo").updateOne(find, { $set: update }, (err, res) => {
                                if (err) console.log("Error: ", err.message);
                                resolve(1);
                            });
                        }
                    });
                    if (!isExist) {
                        if (updateQuery.toString().length == 0) throw reject(new Error("Cannot created document with empty key"));
                        let data = {}; data[updateQuery.toString()] = value;
                        db.collection("Demo").insertOne(data, (err, res) => {
                            if (err) return reject(err);
                            client.close();
                        });
                    }
                });
            });
        });
    }

    deleteData = (updateQuery) => {
        return new Promise((resolve, reject) => {
            mongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true }, (err, client) => {
                if (err) return reject(err);
                const db = client.db(databaseName);

                db.collection("Demo").find({}, { projection: { _id: 0 } }).toArray((err, results) => {
                    if (err) return reject(err);
                    results.forEach((res) => {
                        if (updateQuery.split(".")[0] == Object.entries(res)[0][0]) {
                            let find = this.createfindQuery(res, updateQuery);
                            let update = {}; update[updateQuery] = "";
                            console.log("Find: ", find, "Update: ", update);
                            db.collection("Demo").updateOne(find, { $unset: update }, (err, res) => {
                                if (err) console.log("Error: ", err.message);
                                resolve(1);
                            });
                        }
                    });
                });
            });
        });
    }

    moveData = (source, destination) => {
        return new Promise((resolve, reject) => {
            mongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true }, (err, client) => {
                if (err) return reject(err);
                const db = client.db(databaseName);
                db.collection("Demo").find({}, { projection: { _id: 0 } }).toArray((err, results) => {
                    if (err) return reject(err);
                    let find = {};
                    let moveQuery = {};
                    results.forEach((res) => {
                        if (destination.split(".")[0] == Object.entries(res)[0][0]) {
                            find = this.createfindQuery(res, destination);
                        }
                        if (source.split(".")[0] == Object.entries(res)[0][0]) {
                            let sourceNodes = source.split(".");
                            let doc = res;
                            sourceNodes.forEach((point) => {
                                doc = doc[point];
                            });
                            moveQuery[source] = doc;
                        }
                    });

                    let unset = {}; unset[source] = "";
                    console.log('find: ', moveQuery, "unset: ", unset);
                    let updateQuery = {}; updateQuery[destination+"."+source.split(".").pop()] = moveQuery[source];
                    console.log("then find: ", find, " set: ", updateQuery);

                    db.collection("Demo").updateOne(moveQuery, { $unset: unset }, (err, res) => {
                        if(err) return reject(err);
                        db.collection("Demo").updateOne(find, { $set: updateQuery}, (err, res) => {
                            if(err) return reject(err);
                            resolve(1);
                        });
                    });
                });
            });
        });
    }

    createfindQuery = (document, query) => {
        let queryNodes = query.split(".");
        let doc = document;
        for (let i = 0; i < queryNodes.length; i++) {
            if (doc[queryNodes[i]] != undefined) {
                doc = doc[queryNodes[i]];
            } else {
                console.log("doc not exist: " + queryNodes[i]);
                queryNodes.pop();
            }
        }

        let findquery = {};
        if (typeof doc === "object" && Object.keys(doc).length == 0) {
            findquery[queryNodes.join(".")] = {};
            return findquery;
        } else if (typeof doc === "object") {
            findquery[queryNodes.join(".") + "." + Object.entries(doc)[0][0]] = Object.entries(doc)[0][1];
            return findquery;
        } else {
            findquery[queryNodes.join(".")] = doc;
            return findquery;
        }
    }

}


