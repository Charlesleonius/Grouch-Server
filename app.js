//Imports
require('dotenv').config()
const express = require('express');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const winston = require('winston');

//Globals
const app = express();
const port = process.env.PORT;
const DB_URL = process.env.MONGO_URI;
var DB;

//Middleware
app.use(cors());
app.use(express.json())

/*
* Server Initalization
*/
const LOGGER = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/combined.log' })
    ]
});

app.listen(port, () => 
    LOGGER.log({
        level: 'info',
        message: 'Server restarted'
    })
);

const MONGO_CLIENT = new MongoClient(DB_URL, { useNewUrlParser: true });
MONGO_CLIENT.connect(err => {
    if (err) {
        console.log(err);
    } else {
        DB = MONGO_CLIENT.db("grouch");
    }
});

/*
 * Primary Routes
 */
app.get('/', function (req, res, next) {
    res.status(200).send("OK");
});

app.post('/test', function (req, res, next) {
    DB.collection('trash_level').insert({calculated_level: 2, raw_distance: 2}, function(err, r) {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(200).send("OK");
        }
    });
});

