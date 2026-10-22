const prisma = require("../config/db");

exports.getProducts = async (req, res) => {
  const products = await prisma.product.findMany();

  return res.status(200).json({
    data: products,
  });
};

exports.getProductId = async (req, res) => {
  const id = Number(req.params.id);

  const product = await prisma.product.findUnique({
    where: {
      id: id,
    },
  });

  if (!product) {
    return res.status(404).json({
      message: "Product not found.",
    });
  }

  res.status(200).json({
    data: product,
  });
};

exports.createProduct = async (req, res) => {
  try {
    const product = await prisma.product.create({
      data: {
        name: req.body.name,
        price: Number(req.body.price),
      },
    });

    res.status(201).json({
      data: product,
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Name or Price already exists.",
      });
    }

    res.status(500).json({
      message: "Error creating product.",
      error: error.message,
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const product = await prisma.product.update({
      where: {
        id: id,
      },
      data: {
        name: req.body.name,
        price: Number(req.body.price),
      },
    });

    res.status(200).json({
      data: product,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Name or Price already exists.",
      });
    }

    res.status(500).json({
      message: "Error Update product.",
      error: error.message,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.product.delete({
      where: {
        id: id,
      },
    });

    res.status(200).json({
      message: "Deleting product success.",
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(409).json({
        message: "Product not found.",
      });
    }

    res.status(500).json({
      message: "Error deleting product.",
      error: error.message,
    });
  }
};
