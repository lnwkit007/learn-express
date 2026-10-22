const express = require('express');
const router = express.Router();

const {
  getUsers,
  getUserId,
  createUser,
  updateUser,
  deleteUser,
  getOrdersByUser
} = require("../controllers/user.controller");

router.get("/", getUsers);
router.get("/:id", getUserId);
router.post("/", createUser);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);
router.get("/:id/orders", getOrdersByUser);

module.exports = router;