import mongoose from '../mongoose';

const schema = new mongoose.Schema({
  reference: {
    type: String,
    unique: true,
  },
  title: String,
  description:String,
  main_image: String,
  date_time: Number,
  additional_images:[String]
}, { timestamps: true });

schema.set('toObject', { virtuals: true });
schema.set('toJSON', { virtuals: true });

export const BlogModel = mongoose.model('Blog', schema);
