import {model, models, Schema} from 'mongoose';

const WishlistSchema = new Schema({
  userId: {type: String, required: true},
  jobId: {type: String, required: true},
}, {timestamps: true});

WishlistSchema.index({userId: 1, jobId: 1}, {unique: true});

export const WishlistModel = models?.Wishlist || model('Wishlist', WishlistSchema);