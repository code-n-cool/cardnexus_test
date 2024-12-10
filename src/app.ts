import express from 'express';
import mongoose from 'mongoose';
import { router as cardRouter } from './routes/cardRoutes';
import { ingestData } from './services/dataService';
import redis from './services/redisService';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

mongoose.connect(process.env.MONGODB_URI!)
  .then(() => {
    console.log('MongoDB connected');
    ingestData();
})
  .catch(err => {
    console.error('MongoDB connection error:', err); 
    process.exit(1);
});

app.use('/api', cardRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on('SIGINT', async () => {
  console.log('Closing Redis and MongoDB connections gracefully...');
  await redis.disconnect();
  await mongoose.disconnect();
  process.exit(0);
});
  
process.on('SIGTERM', async () => {
  console.log('Received SIGTERM, closing Redis and MongoDB connections...');
  await redis.disconnect();
  await mongoose.disconnect();
  process.exit(0);
});