const express = require("express");
const router = express.Router();

const {
  getOrders,
  getOrderId,
  createOrder,
  updateOrder,
  deleteOrder,
  getProductsByOrder
} = require("../controllers/order.controller");

router.get("/", getOrders);
router.get("/:id", getOrderId);
router.post("/", createOrder);
router.patch("/:id", updateOrder);
router.delete("/:id", deleteOrder);
router.get("/:id/products", getProductsByOrder);

module.exports = router;