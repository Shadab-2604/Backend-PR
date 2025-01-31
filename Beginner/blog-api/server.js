const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');  // Add dotenv to load .env variables
const app = express();
const port = 5000;

// Load environment variables from .env file
dotenv.config();

// Middleware to parse JSON data
app.use(express.json());

// MongoDB connection using URI from environment variable
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));

// Define Mongoose schema for blog posts
const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true }
});

// Create the model for blog posts
const BlogPost = mongoose.model('BlogPost', blogPostSchema);

// Routes (same as before)
// 1. Create a new blog post
app.post('/api/posts', async (req, res) => {
  const { title, content, author } = req.body;
  try {
    const newPost = new BlogPost({ title, content, author });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: 'Error creating blog post' });
  }
});

// 2. Get all blog posts
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await BlogPost.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching blog posts' });
  }
});

// 3. Get a specific blog post by ID
app.get('/api/posts/:id', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching the post' });
  }
});

// 4. Update a blog post by ID
app.put('/api/posts/:id', async (req, res) => {
  const { title, content, author } = req.body;
  try {
    const post = await BlogPost.findByIdAndUpdate(
      req.params.id,
      { title, content, author },
      { new: true }
    );
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'Error updating the post' });
  }
});

// 5. Delete a blog post by ID
app.delete('/api/posts/:id', async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting the post' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
