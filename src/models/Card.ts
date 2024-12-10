import mongoose, { Document, Schema } from 'mongoose';

interface ICard extends Document {
  id: string;
  name: string;
  rarity: string;
  color?: string;
  ink_cost?: number;
  game: 'mtg' | 'lorcana';
}

const cardSchema = new Schema<ICard>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  rarity: { type: String, required: true },
  color: { type: String, enum: ['U', 'B', 'G', 'R', 'W'], default: null },
  ink_cost: { type: Number, default: null },
  game: { type: String, enum: ['mtg', 'lorcana'], required: true },
});

// Indexes for faster searching
cardSchema.index({ name: 'text' });
cardSchema.index({ rarity: 1 });
cardSchema.index({ color: 1 });
cardSchema.index({ ink_cost: 1 });

const Card = mongoose.model<ICard>('Card', cardSchema);

export { Card, ICard };
