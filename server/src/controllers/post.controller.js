const prisma = require("../config/db");

exports.getPost = async (req, res) => {
  const posts = await prisma.post.findMany({
    select: {
        id: true,
        title: true,
        description: true,
        user: true
    }
  });

  res.status(200).json({
    data: posts,
  });
};

exports.getPostId = async (req, res) => {
  const id = Number(req.params.id);

  const post = await prisma.post.findUnique({
    where: {
      id: id,
    },
    select: {
        id: true,
        title: true,
        description: true,
        user: true
    }
  });

  if (!post) {
    return res.status(404).json({
      message: "Post not found.",
    });
  }

  res.status(200).json({
    data: post,
  });
};

exports.createPost = async (req, res) => {
  try {
    const { title, description, userId } = req.body;

    const post = await prisma.post.create({
      data: {
        title: title,
        description: description,
        userId: userId,
      },
    });

    res.status(201).json({
      data: post,
    });
  } catch (error) {
    if (error.code === "P2003") {
      return res.status(400).json({
        message: "Invalid user ID or product ID.",
      });
    }

    res.status(500).json({
      message: "Error creating post.",
      error: error.message,
    });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, description, userId } = req.body;

    const post = await prisma.post.update({
      where: {
        id: id,
      },
      data: {
        title: title,
        description: description,
        userId: userId,
      },
    });

    res.status(200).json({
      data: post,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(409).json({
        message: "Post not found.",
      });
    }

    if (error.code === "P2002") {
      return res.status().json({
        message: "Title or Description already exists.",
      });
    }

    res.status(500).json({
      message: "Error Update post.",
      error: error.message,
    });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.post.delete({
      where: {
        id: id,
      },
    });

    res.status(200).json({
      message: "Deleting post success.",
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(409).json({
        message: "Post not found.",
      });
    }

    res.status(500).json({
      message: "Error deleting post.",
      error: error.message,
    });
  }
};