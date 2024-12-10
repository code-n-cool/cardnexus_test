import Redis from 'ioredis';

const redis = new Redis({
  host: 'localhost', 
  port: 6379,        
  reconnectOnError: (err) => {
    if (err.message.includes('ECONNREFUSED')) {
      console.error('Redis connection refused, shutting down application...');
      process.exit(1); 
    }
    return true; 
  },
});

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
