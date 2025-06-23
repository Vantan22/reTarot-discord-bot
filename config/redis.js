import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();
const tokenRedis = new Redis(process.env.TOKEN_REDIS_URL);
const authCountRedis = new Redis(process.env.AUTH_REDIS_URL);
export { tokenRedis, authCountRedis };
