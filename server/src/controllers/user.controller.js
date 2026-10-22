const prisma = require("../config/db");

exports.getUsers = async (req, res) => {
  const users = await prisma.user.findMany();

  res.status(200).json({
    data: users,
  });
};

exports.getUserId = async (req, res) => {
  const id = Number(req.params.id);

  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  if (!user) {
    return res.status(404).json({
      message: "User not found.",
    });
  }

  res.status(200).json({
    data: user,
  });
};

exports.createUser = async (req, res) => {
  try {
    const user = await prisma.user.create({
      data: {
        fname: req.body.fname,
        lname: req.body.lname,
        username: req.body.username,
        email: req.body.email,
      },
    });

    res.status(201).json({
      data: user,
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Username or Email already exists.",
      });
    }

    res.status(500).json({
      message: "Error creating user.",
      error: error.message,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const user = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        fname: req.body.fname,
        lname: req.body.lname,
        username: req.body.username,
        email: req.body.email,
      },
    });

    res.status(200).json({
      data: user,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Username or Email already exists.",
      });
    }

    res.status(500).json({
      message: "Error Upate user.",
      error: error.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.user.delete({
      where: {
        id: id,
      },
    });

    return res.status(200).json({
      message: "Deleting user success.",
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    res.status(500).json({
      message: "Error deleting user.",
      error: error.message,
    });
  }
};

exports.getOrdersByUser = async (req, res) => {
  const id = Number(req.params.id);

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: id,
      },
      include: {
        user: true,
        products: {
          include: {
            product: true,
          },
        },
      },
    });

    return res.status(200).json({
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching user orders.",
      error: error.message
    });
  }
};
