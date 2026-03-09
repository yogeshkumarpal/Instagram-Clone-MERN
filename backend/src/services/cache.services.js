const Redis = require("ioredis");

// This will look for a single variable called REDIS_URL
const cacheClient = new Redis(process.env.REDIS_URL);

module.exports = cacheClient;
