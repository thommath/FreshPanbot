import { connect } from "redis";

export const REDIS_QUEUE_KEY = "panbot-queue";
export const REDIS_HISTORY_KEY = "panbot-history";
export const REDIS_TO_PRINT_KEY = "panbot-item-to-print";

export const redis = connect({
    hostname: "redis.redis.svc.cluster.local",
    port: 6379,
});
