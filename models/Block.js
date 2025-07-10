// backend/models/Block.js
import mongoose from 'mongoose';

const blockSchema = new mongoose.Schema({
  id: { type: String, required: true }, 
  type: String,
  content: String,
  position: {
    x: Number,
    y: Number,
  },
  size: {
    width: Number,
    height: Number,
  }
});

const Block = mongoose.models.Block || mongoose.model('Block', blockSchema);

export default Block;
