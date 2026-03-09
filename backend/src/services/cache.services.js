import Redis from "ioredis";

const cacheClient = new Redis(process.env.REDIS_URL);

cacheClient.on("connect", () => {
  console.log("Redis connected");
});

cacheClient.on("error", (err) => {
  console.log("Redis error:", err);
});

