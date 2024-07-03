const express = require('express');
const fetch = require('node-fetch');
const geoip = require('geoip-lite');

function apiResponse(req, res) {
    const visitor_name = req.query.visitor_name;
    const ipAddress = "103.86.96.100"; // req.ip;
    const geodata = geoip.lookup(ipAddress);

    if (!geodata) {
        const error = {
            errorType: "server_error",
            errorCode: 500,
            errorMsg: new Error("Could not look up the client ip").message
        };
        return res.json(error);
    }

    fetch(`http://api.weatherapi.com/v1/current.json?key=d8dbdedcd37248dea52204502240207&q=${geodata.city}`)
        .then((response) => {
            return response.json();
        })
        .then((weatherData) => {
            const info = {
                "client_ip": `${ipAddress}`,
                "location": `${geodata.city}`,
                "greeting": `Hi ${visitor_name}, It's ${weatherData.current.temp_c}°C in ${geodata.city} today!`
            };
            console.log(info);
            return res.json(info);
        })
        .catch((error) => {
            const fetchError = {
                errorType: "server_error",
                errorCode: 500,
                errorMsg: error.message
            };
            return res.json(fetchError);
        });
}

module.exports = { apiResponse };
