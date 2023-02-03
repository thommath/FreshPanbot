import { connect } from "redis";

export const REDIS_QUEUE_KEY = "panbot-queue";

export const redis = connect({
    hostname: "redis.redis.svc.cluster.local",
    port: 6379,
});
