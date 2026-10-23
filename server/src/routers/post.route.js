const express = require("express");
const router = express.Router();

const {
  getPost,
  getPostId,
  createPost,
  updatePost,
  deletePost,
} = require("../controllers/post.controller");

router.get("/", getPost);
router.get("/:id", getPostId);
router.post("/", createPost);
router.patch("/:id", updatePost);
router.delete("/:id", deletePost);

module.exports = router;
