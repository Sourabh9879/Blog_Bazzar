// routes/blog.js

const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const Blog = require('../model/blog.model');
const isAdmin = require('../middleware/admin');
const Comment = require('../model/comment.model');
const nodemailer = require('nodemailer')
// Create post (protected route)
router.post('/create-post', async (req, res) => {
    try {
        const { title, content, category, coverImg, createdAt } = req.body;

        // console.log("UserId: ", req.userId)
        const newPost = new Blog({
            ...req.body,
            author: req.userId,
        });
        await newPost.save();
        res.status(201).send({ message: 'Post created successfully', post: newPost });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).send({ message: 'Failed to create post' });
    }
});

// Get all posts (public route)
router.get('/', async (req, res) => {
    try {
        const { search, category, location  } = req.query;
        // console.log(search)

        let query = {};

        if (search) {
            query = {
                ...query,
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { content: { $regex: search, $options: 'i' } }
                ]
            };
        }

        if (category) {
            query = { ...query, category };
        }
        if (location) {
            query = { ...query, location };
        }
        const posts = await Blog.find(query).populate('author', 'email').sort({ createdAt: -1 }); // Adjust populate fields as necessary
        res.status(200).send(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).send({ message: 'Failed to fetch posts' });
    }
});

// Get a single post (protected route)
router.get('/:id',async (req, res) => {
    try {
        const postId = req.params.id;
        // console.log(postId)
        
        const post = await Blog.findById(postId).populate('author', 'email username');
        // console.log(post)

        if (!post) {
            return res.status(404).send({ message: 'Post not found' });
        }

        const comments = await Comment.find({ postId: postId }).populate('user', 'username email');

        res.status(200).send({ post, comments });
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).send({ message: 'Failed to fetch post' });
    }
});


// update a post (protected route)
router.patch('/update-post/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const postId = req.params.id;
        // const { title, content, category } = req.body;
        const updatedPost = await Blog.findByIdAndUpdate(postId, { ...req.body }, { new: true });
        
        if (!updatedPost) {
            return res.status(404).send({ message: 'Post not found' });
        }
        
        res.status(200).send({ message: 'Post updated successfully', post: updatedPost });
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).send({ message: 'Failed to fetch post' });
    }
})

// delete a post with the related comment
router.delete('/:id', async (req, res) => {
    try {
        const postId = req.params.id;

        // Find and delete the blog post
        const post = await Blog.findByIdAndDelete(postId);

        if (!post) {
            return res.status(404).send({ message: 'Post not found' });
        }

        // Delete associated comments
        await Comment.deleteMany({ postId: postId });

        res.status(200).send({ message: 'Post and associated comments deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).send({ message: 'Failed to delete post' });
    }
});

//related blog
router.get('/related/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      // Check if id is defined
      if (!id) {
        return res.status(400).send({ message: 'Blog ID is required' });
      }
  
      const blog = await Blog.findById(id);
  
      if (!blog) {
        return res.status(404).send({ message: 'Blog post not found' });
      }
  
      // Create a regex to match similar titles
      const titleRegex = new RegExp(blog.title.split(' ').join('|'), 'i');
  
      const relatedQuery = {
        _id: { $ne: id }, // Exclude the current blog post
        title: { $regex: titleRegex } // Match similar titles
      };
  
      const relatedPosts = await Blog.find(relatedQuery);
  
      res.status(200).send(relatedPosts);
    } catch (error) {
      console.error('Error fetching related posts:', error);
      res.status(500).send({ message: 'Failed to fetch related posts' });
    }
  });

    // routes/blog.js

// Like a post
router.patch('/like/:id', verifyToken, async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.userId;

        const post = await Blog.findById(postId);

        if (!post) {
            return res.status(404).send({ message: 'Post not found' });
        }

        // Check if user has already liked the post
        if (post.likes.includes(userId)) {
            // Remove the like
            post.likes.pull(userId);
        } else {
            // Add like and remove dislike if it exists
            post.likes.push(userId);
            post.dislikes.pull(userId);
        }

        await post.save();
        res.status(200).send({ message: 'Post liked/disliked successfully', likes: post.likes.length, dislikes: post.dislikes.length });
    } catch (error) {
        console.error('Error liking post:', error);
        res.status(500).send({ message: 'Failed to like post' });
    }
});

// Dislike a post
router.patch('/dislike/:id', verifyToken, async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.userId;

        const post = await Blog.findById(postId);

        if (!post) {
            return res.status(404).send({ message: 'Post not found' });
        }

        // Check if user has already disliked the post
        if (post.dislikes.includes(userId)) {
            // Remove the dislike
            post.dislikes.pull(userId);
        } else {
            // Add dislike and remove like if it exists
            post.dislikes.push(userId);
            post.likes.pull(userId);
        }

        await post.save();
        res.status(200).send({ message: 'Post disliked/liked successfully', likes: post.likes.length, dislikes: post.dislikes.length });
    } catch (error) {
        console.error('Error disliking post:', error);
        res.status(500).send({ message: 'Failed to dislike post' });
    }
});

router.post('/send-email', async (req, res) => {
    const { email, title, htmlContent } = req.body;

    // Set up nodemailer transport
    const transporter = nodemailer.createTransport({
        service: 'Gmail', // or any other email service
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: `Blog: ${title}`,
        html: `Check out New Blog
        <a href="http://localhost:5173/blogs/${Blog._id}">${title}</a>`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('email sent');
    }
});


module.exports = router;
