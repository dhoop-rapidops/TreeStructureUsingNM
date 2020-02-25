const express = require('express');
const fs = require("fs");
const bodyParser = require("body-parser");
const Bank = require('./modules/api/allData');

const bank = Bank.getInstance();
const urlEncoder = bodyParser.urlencoded({ extended: false });

const app = express();
app.use("/js", express.static("js"));
app.use("/css", express.static("css"));


app.get('/index', (req, res) => {
    fs.createReadStream(__dirname + "/index.html").pipe(res);
});


app.post("/index", urlEncoder, (req, res) => {
    if (req.body.action == "add") {
        console.log(req.body);
        let find = req.body.query == "parent" ? req.body.key : req.body.query + "." + req.body.key;
        bank.insertData(find, req.body.value == '' ? {} : req.body.value)
            .then((val) => {
                fs.createReadStream(__dirname + "/index.html").pipe(res);
                console.log(val);
            }).catch((err) => {
                res.set({
                    'content-type': 'text/plain'
                });
                res.send("Error: " + err.message);
                console.log("Err : " + err.message);
            });
    } else if (req.body.action == "update") {
        console.log(req.body);
        bank.updateData(req.body.query.split(":")[0], req.body.value)
            .then((val) => {
                fs.createReadStream(__dirname + "/index.html").pipe(res);
                console.log(val);
            }).catch((err) => {
                res.set({
                    'content-type': 'text/plain'
                });
                res.send("Error: " + err.message);
                console.log("Err : " + err.message);
            });
    } else if (req.body.action == "remove") {
        console.log(req.body);
        bank.deleteData(req.body.query.split(":")[0])
            .then((val) => {
                fs.createReadStream(__dirname + "/index.html").pipe(res);
                console.log(val);
            }).catch((err) => {
                res.set({
                    'content-type': 'text/plain'
                });
                res.send("Error: " + err.message);
                console.log("Err : " + err.message);
            });
    } else if (req.body.action == "move") {
        console.log(req.body);
        bank.moveData(req.body.query, req.body.value)
            .then((val) => {
                fs.createReadStream(__dirname + "/index.html").pipe(res);
                console.log(val);
            }).catch((err) => {
                res.set({
                    'content-type': 'text/plain'
                });
                res.send("Error: " + err.message);
                console.log("Err : " + err.message);
            });
    }
    //fs.createReadStream(__dirname + "/index.html").pipe(res);
});



app.get("/api/alldata", (req, res) => {
    res.set({
        'content-type': 'application/json'
    });
    bank.allData().then((result) => {
        res.send(JSON.stringify(result));
    }).catch((err) => {
        throw err;
    });
});

app.listen("3696");
