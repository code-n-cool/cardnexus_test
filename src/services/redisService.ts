import Redis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

const redis = new Redis(process.env.REDIS_URL!);

redis.on('connect', () => {
  console.log('Connected to Redis');
});

redis.on('ready', () => {
  console.log('Redis connection is ready');
});

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
  process.exit(1);
});

redis.on('close', () => {
  console.log('Redis connection closed');
});

redis.on('end', () => {
  console.warn('Redis connection has ended.');
});

export default redis;
