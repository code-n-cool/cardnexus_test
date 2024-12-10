import { hash } from 'crypto'; 
import express from 'express';
import { Card } from '../models/Card';
import redis from '../services/redisService';

const router = express.Router();

const generateCacheKey = (params: any) => {
  const queryString = JSON.stringify(params);
  return hash('sha256', queryString, 'hex');
};

router.get('/cards', async (req, res) => {
  const {
    game,
    name,
    rarity,
    color,
    minInkCost,
    maxInkCost,
  } = req.query;

  const filter: any = {};

  if (game) filter.game = game;

  if (name) filter.name = { $regex: name, $options: 'i' };

  if (rarity) {
    const rarityArray = Array.isArray(rarity) ? rarity : [rarity];
    filter.rarity = { $in: rarityArray };
  }

  if (color) filter.color = color;

  if (minInkCost || maxInkCost) {
    filter.ink_cost = {};
    if (minInkCost) filter.ink_cost.$gte = parseInt(minInkCost as string);
    if (maxInkCost) filter.ink_cost.$lte = parseInt(maxInkCost as string);
  }

  const cacheKey = generateCacheKey(req.query);

  try {
    const cachedResult = await redis.get(cacheKey);

    if (cachedResult) {
      console.log('Returning cached results...');
      res.json(JSON.parse(cachedResult));
      return
    }

    const cards = await Card.find(filter);

    redis.setex(cacheKey, 60, JSON.stringify(cards));

    res.json(cards);
  } catch (error) {
    console.error('Error fetching cards:', error);
    res.status(500).json({ message: 'Error fetching cards' });
  }
});

export { router };
