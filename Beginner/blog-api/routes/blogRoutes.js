const express = require("express");
const router = express.Router();
const { getAllPosts, getPostById, createPost, updatePost, deletePost } = require("../controllers/blogController");

// ✅ Define Routes
router.get("/posts", getAllPosts); // Get all posts (with optional search)
router.get("/posts/:id", getPostById); // Get a single post
router.post("/posts", createPost); // Create a new post
router.put("/posts/:id", updatePost); // Update a post
router.delete("/posts/:id", deletePost); // Delete a post

module.exports = router;
