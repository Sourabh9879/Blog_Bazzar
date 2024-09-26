const mongoose = require('mongoose');

const FeatureSchema = new mongoose.Schema({
    name: { type: String, required: true },
    value: { type: String, required: true }
});

const BlogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    content: { type: Object, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    coverImg: String,
    category: String, 
    rating:  { type: Number, default: 0 },

    createdAt: { type: Date, default: Date.now },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],  // Store users who liked the post
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const Blog = mongoose.model('Blog', BlogSchema);

module.exports = Blog;