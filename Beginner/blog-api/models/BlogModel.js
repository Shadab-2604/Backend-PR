const mongoose = require("mongoose");

const BlogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true },
    tags: [String]
  },
  { timestamps: true }
);

module.exports = mongoose.model("BlogPost", BlogPostSchema);
