import mongoose from 'mongoose';

const UserBlogPostSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  blog_post_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog',
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model('UserBlogPost', UserBlogPostSchema);
