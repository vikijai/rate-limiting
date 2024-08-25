const express = require('express');
const router = express.Router();
const { readLogs } = require('./logger');

// Home Route
router.get("/", async (_, res) => {
    return res.status(200).send(`
    Welcome to Rate-limiter 
    1. GET          /logs        - to get all logs
    `);
});

// Logs Route - To get all the logs.
router.get("/logs", async (_, res) => {
    const logs = await readLogs();
    return res.status(200).send(`<pre>${logs}</pre>`);
});

module.exports = router;
