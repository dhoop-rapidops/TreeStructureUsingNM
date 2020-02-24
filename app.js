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
    console.log("body--", req.body);
    if(req.body.action == "add") {
        
    }
    fs.createReadStream(__dirname + "/index.html").pipe(res);
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

app.get("/api/add", (req, res) => {
    bank.insertData().then((result) => {
        res.send(result);
    }).catch((err) => {
        throw err;
    });
});

app.listen("3696");
