const express = require('express');
const router = express.Router();
const db = require('../models/db');
const request = require('request');
const passwordHash = require('password-hash');
const NodeGeocoder = require('node-geocoder');

const options = {
    provider: 'google',
    httpAdapter: 'https',
    apiKey: 'AIzaSyAs78IwViXHXBxA3UjO0ZvfrFntqA1F4mU',
    formatter: null
};

const geocoder = NodeGeocoder(options);

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
        request('http://freegeoip.net/json/', (error, response, body) => {
            let data = JSON.parse(body);
            geocoder.reverse({lat: data.latitude, lon: data.longitude}, async (err, res) => {
                await db.updateOne('users', { login: req.session.login }, {
                    $set: {
                        tmpAddress: res[0].formattedAddress,
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
        req.flash('error', 'Unauthorized access');
        res.redirect('/');
    }
});

module.exports = router;