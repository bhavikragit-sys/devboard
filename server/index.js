const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

let posts = [
  {
    id: 1,
    username: "Rahul",
    content: "How do I learn DSA?",
  },
];
// view all post
app.get("/posts", (req, res) => {
  res.json(posts);
});
// Add a post
app.post("/posts", (req, res) => {
  const newPost = {
    id: posts.length + 1,
    username: req.body.username,
    content: req.body.content,
  };

  posts.push(newPost);

  res.json(newPost);
});

// View a particular post using id
app.get("/posts/:id", (req, res) => {
  const post = posts.find((post) => post.id == req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  res.json(post);
});

//Delete post
app.delete("/posts/:id", (req, res) => {
  const index = posts.findIndex((post) => post.id == req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: "Post not found" });
  }
  posts.splice(index, 1);
  res.json(posts);
});

// update
app.patch("/posts/:id", (req, res) => {
  const post = posts.find((post) => post.id == req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  if (req.body.username !== undefined) {
    post.username = req.body.username;
  }

  if (req.body.content !== undefined) {
    post.content = req.body.content;
  }
  res.json(post);
});

//server
app.listen(3000, () => {
  console.log("Server running");
});
