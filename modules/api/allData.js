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
                db.collection("Users").find({}).toArray((err, results) => {
                    if (err) return reject(err);
                    client.close();
                    results.forEach((res) => { console.log(res) });
                    return resolve(results);
                });
            });
        });
    }

    insertData = (key, value) => {
        return new Promise((resolve, reject) => {
            mongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true }, (err, client) => {
                if (err) return reject(err);
                const db = client.db(databaseName);
                let customers = {
                    customers: [
                        { name: "Dhoop", email: "dhoopgmail.com" },
                        { name: "dulari", email: "dularigmail.com" },
                        { name: "aman", email: "amangmail.com" },
                    ]
                };
                //let obj = { name: "abhi", email: "abhi@gmail.com", courses: [ { courseName: "node", facultName: "raju" } ] };
                /*db.collection("Users").deleteOne({}, { $unset: { employees: "" } }, (err, res) => {
                    if (err) return reject(err);
                    client.close();
                    resolve(res.result);
                });*/
                /*db.collection("Users").insertOne(customers, (err, res) => {
                    if (err) return reject(err);
                    client.close();
                    resolve(res.result);
                });*/

                db.collection("Users").updateOne({ name: "dhoop" }, { $set: { name: "dhup" } }, (err, res) => {
                    if (err) return reject(err);
                    client.close();
                    resolve(res.result);
                });

            });
        });
    }
}


