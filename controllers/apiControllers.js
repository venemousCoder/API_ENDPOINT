const express = require('express');
const fetch = require('node-fetch');
const geoip = require('geoip-lite');

const app = express();

// Trust the proxy to get the real client IP
app.set('trust proxy', true);

function getClientIp(req) {
    const xForwardedFor = req.headers['x-forwarded-for'];
    if (xForwardedFor) {
        // 'x-forwarded-for' may return a comma-separated list of IP addresses, take the first one
        return xForwardedFor.split(',')[0];
    }
    // Fall back to req.connection.remoteAddress
    return req.connection.remoteAddress;
}
function apiResponse(req, res) {
    const visitor_name = req.query.visitor_name;
    const ipAddress = getClientIp(req);
    const geodata = geoip.lookup(ipAddress);
    const lat = geodata.ll[0];
    const lon = geodata.ll[1];
    console.log(ipAddress, geodata);
    if (!geodata) {
        const error = {
            errorType: "server_error",
            errorCode: 500,
            errorMsg: new Error("Could not look up the client ip").message
        };
        return res.json(error);
    }
      
    fetch(`http://api.weatherapi.com/v1/current.json?key=${process.env.API_KEY}&q=${ipAddress}`)
        .then((response) => {
            return response.json();
        })
        .then((weatherData) => {
            const info = {
                "client_ip": `${ipAddress}`,
                "location": `${weatherData.location.region || geodata.city}`,
                "greeting": `Hi ${visitor_name}, It's ${weatherData.current.temp_c}°C in ${weatherData.location.region || geodata.city} today!`
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
