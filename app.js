//Imports
require('dotenv').config()
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const winston = require('winston');
const moment = require('moment');

//Globals
const app = express();
const port = process.env.PORT;
const DB_URL = process.env.MONGO_URI;
var db;

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

mongoose.set('debug', true);
mongoose.connect(DB_URL, {useNewUrlParser: true}).then(connectedDB => {
    db = connectedDB;
    app.listen(port, () =>
        LOGGER.log({
            level: 'info',
            message: 'Server restarted'
        })
    );
})

/*
 * Primary Routes
 */
app.get('/', function (req, res, next) {
    res.status(200).send("OK");
});

var openSchema = new Schema({}, { strict: false });
var Container = mongoose.model('container', openSchema);
app.post('/heightRecord/:containerId', function (req, res, next) {
    let timeStampKey = `heightRecords.${moment().unix()}`;
    Container.updateOne(
        { _id: req.params.containerId },
        {
            $push: {
                wasteLevels: req.body.distance,
                wasteTimes: moment().format("YYYY-MM-DD HH:mm:ss")
            }
        }
    ).then(() => {
        res.status(200).send("OK");
    }).catch(err => {
        res.status(500).send(err);
    })
});

