import { Queue } from "bullmq";
import { client } from "../config/redis.js";


const resultQueue = new Queue("resultQueue", {
  connection: client,
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: true,
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 3000,
    },
  },
});

export default resultQueue;
