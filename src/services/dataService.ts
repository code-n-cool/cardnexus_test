import axios from 'axios';
import { Card } from '../models/Card';

export const ingestData = async () => {
  try {
    const mtgData = await axios.get('https://cardnexus-hiring-docs.s3.eu-west-1.amazonaws.com/mtg-cards.json');
    const lorcanaData = await axios.get('https://cardnexus-hiring-docs.s3.eu-west-1.amazonaws.com/lorcana-cards.json');

    const mtgCards = mtgData.data.map((card: any) => ({
      ...card,
      game: 'mtg',
    }));

    const lorcanaCards = lorcanaData.data.map((card: any) => ({
      ...card,
      game: 'lorcana',
    }));

    // Insert data into the database
    await Card.insertMany([...mtgCards, ...lorcanaCards]);
    console.log('Data ingestion completed successfully.');
  } catch (error) {
    console.error('Error during data ingestion:', error);
  }
};

