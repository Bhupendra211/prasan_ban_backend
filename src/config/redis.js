import "dotenv/config";
import { Worker, Queue } from "bullmq";
import Redis from "ioredis";

const client = new Redis(process.env.UPSTASH_REDIS_URL, {
    tls: { rejectUnauthorized: false },
    maxRetriesPerRequest: null
}
);

// Handle Redis events
client.on("error", (err) => console.error("Redis Error:", err));
client.on("connect", () => console.log("Connected to Redis"));
client.on("ready", () => console.log("Redis Ready to Use"));
client.on("end", () => console.log("Redis Connection Closed"));

export { Redis, client, Queue, Worker };
