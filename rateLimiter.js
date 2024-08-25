const BLOCK_DURATION = 1000 * 60; // 1 minute block duration
const RATE_LIMIT_PER_MIN = 5; // Maximum 5 requests per minute per IP
const WINDOW_SIZE = 60 * 1000; // 1 minute

let requestLog = {};

async function rateLimiter(ip) {
    const now = Date.now();

    // Initialize requestLog for new IPs
    if (!requestLog[ip]) {
        requestLog[ip] = { timestamps: [], blockedUntil: 0 };
    }

    // Check if the current time is past the block duration
    if (now <= requestLog[ip].blockedUntil) {
        return { blocked: true, blockedUntil: requestLog[ip].blockedUntil };
    }

    // Remove timestamps older than the window size
    requestLog[ip].timestamps = requestLog[ip].timestamps.filter(timestamp => now - timestamp < WINDOW_SIZE);

    // Check if the request count exceeds the rate limit
    if (requestLog[ip].timestamps.length >= RATE_LIMIT_PER_MIN) {
        requestLog[ip].blockedUntil = now + BLOCK_DURATION;
        console.log('Rate Limit Exceeded: true');
        return { blocked: true, blockedUntil: requestLog[ip].blockedUntil };
    }

    // Log the current request timestamp
    requestLog[ip].timestamps.push(now);
    return { blocked: false, blockedUntil: requestLog[ip].blockedUntil };
}

module.exports = rateLimiter;
