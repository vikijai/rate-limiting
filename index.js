const express = require('express');
const rateLimiter = require('./rateLimiter');
const { appendLogs } = require('./logger');
const routes = require('./routes');

const app = express();
const port = 8000;

// Middleware to parse the body of the request
app.use(express.json());

// Middleware to log the request and check the rate limit
app.use(async (req, res, next) => {
    const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
    const url = req.url;
    const method = req.method;
    const date = new Date()
    const { blocked, blockedUntil } = await rateLimiter(ip);
    await appendLogs({ ip, date, url, method, blocked, blockedUntil });

    if (blocked) {
        return res.status(429).send("Too many requests, try again after some time");
    } else {
        next();
    }
});

// Use the routes
app.use(routes);

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});
