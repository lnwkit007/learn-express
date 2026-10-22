const prisma = require("../config/db");

exports.getOrders = async (req, res) => {
  const orders = await prisma.order.findMany({
    include: {
      user: true,
      products: {
        include: {
          product: true,
        },
      },
    },
  });

  res.status(200).json({
    data: orders,
  });
};

exports.getOrderId = async (req, res) => {
  const id = Number(req.params.id);

  const order = await prisma.order.findUnique({
    where: {
      id: id,
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

  if (!order) {
    return res.status(404).json({
      message: "Order not found.",
    });
  }

  res.status(200).json({
    data: order,
  });
};

exports.createOrder = async (req, res) => {
  try {
    const { userId, productIds } = req.body;

    const order = await prisma.order.create({
      data: {
        userId: userId,
        products: {
          create: productIds.map((pid) => ({
            productId: pid,
          })),
        },
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

    res.status(201).json({
      data: order,
    });
  } catch (error) {
    if (error.code === "P2003") {
      return res.status(400).json({
        message: "Invalid user ID or product ID.",
      });
    }

    res.status(500).json({
      message: "Error creating order.",
      error: error.message,
    });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { userId, productIds } = req.body;

    const order = await prisma.order.update({
      where: {
        id: id,
      },
      data: {
        userId: userId,
        products: {
          deleteMany: {},
          create: productIds.map((pid) => ({
            product: {
              connect: {
                id: pid,
              },
            },
          })),
        },
      },
    });

    res.status(200).json({
      data: order,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(409).json({
        message: "Order not found.",
      });
    }

    if (error.code === "P2003") {
      return res.status(400).json({
        message: "Invalid user ID or product ID.",
      });
    }

    res.status(500).json({
      message: "Error update order.",
      error: error.message,
    });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.$transaction(async (tx) => {
      await tx.orderProduct.deleteMany({
        where: {
          orderId: id,
        },
      });

      await tx.order.delete({
        where: {
          id: id,
        },
      });
    });

    res.status(200).json({
      message: "Deleting order success.",
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    res.status(500).json({
      message: "Error Deleting order.",
      error: error.message,
    });
  }
};

exports.getProductsByOrder = async (req, res) => {
  const id = Number(req.params.id);

  try {
    const order = await prisma.order.findUnique({
      where: {
        id: id,
      },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    const products = order.products.map(pid => pid.product);

    res.status(200).json({
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching order products.",
      error: error.message,
    });
  }
};
