const BlogPost = require("../models/blogModel"); // Ensure this model is correctly set up

// ✅ Get all blog posts with optional search filtering
const getAllPosts = async (req, res) => {
    try {
        const { term } = req.query;
        let query = {};

        if (term) {
            query = {
                $or: [
                    { title: { $regex: term, $options: "i" } },
                    { content: { $regex: term, $options: "i" } },
                    { category: { $regex: term, $options: "i" } }
                ]
            };
        }

        const posts = await BlogPost.find(query);
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Get a single blog post
const getPostById = async (req, res) => {
    try {
        const post = await BlogPost.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Create a new blog post
const createPost = async (req, res) => {
    try {
        const { title, content, category, tags } = req.body;
        if (!title || !content) {
            return res.status(400).json({ message: "Title and content are required" });
        }

        const newPost = new BlogPost({ title, content, category, tags });
        await newPost.save();

        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Update an existing blog post
const updatePost = async (req, res) => {
    try {
        const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!post) return res.status(404).json({ message: "Post not found" });

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Delete a blog post
const deletePost = async (req, res) => {
    try {
        const post = await BlogPost.findByIdAndDelete(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Export all controllers
module.exports = { getAllPosts, getPostById, createPost, updatePost, deletePost };
