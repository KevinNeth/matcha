const express = require('express');
const router = express.Router();
const db = require('../models/db');
const request = require('request');
// const socketIO = require('../core/controllers/socket');
const passwordHash = require('password-hash');

router.post('/getAddress', async (req, res) => {
    await db.updateOne('users', { login: req.session.login }, { $set: {
        tmpAddress: req.body.tmpAddress, 
        tmpLat: req.body.tmpLat,
        tmpLng: req.body.tmpLng
    }});
    let user = await db.findOne('users', { login: req.session.login });
    if (user['location'] === undefined) {
        await db.updateOne('users', { login: req.session.login }, { $set: {
            location: {
                type: "Point",
                coordinates: [
                    parseFloat(req.body.tmpLng),
                    parseFloat(req.body.tmpLat)
                ]
            }
        }} );
        res.send("Okay");
    } else {
        res.send("Okay");
    }
});

router.get('/forceGetPos', function(req, res, next){
    if (req.session.login !== undefined) {
        request('http://freegeoip.net/json/', function(error, response, body) {
            let data = JSON.parse(body);
            request('http://maps.googleapis.com/maps/api/geocode/json?latlng=' + data.latitude + ',' + data.longitude, async function(error, response, body){
                let infos = JSON.parse(body);
                await db.updateOne('users', { login: req.session.login }, {
                    $set: {
                        tmpAddress: infos['results'][0]['formatted_address'],
                        tmpLat: data.latitude,
                        tmpLng: data.longitude
                    }
                })
                let user = await db.findOne('users', { login: req.session.login });
                if (user['lat'] === undefined) {
                    await db.updateOne('users', { login: req.session.login }, { $set: {
                        location: {
                            type: "Point",
                            coordinates: [
                                parseFloat(data.longitude),
                                parseFloat(data.latitude)
                            ]
                        }
                    }} );
                }
            });
        });
    } else {
        req.session.errors = [];
        req.session.errors.push({ msg: 'No access right' });
        res.redirect('/');
    }
});

module.exports = router;