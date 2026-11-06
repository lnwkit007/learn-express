const express = require("express");
const cors = require("cors");
const prisma = require("./config/db");

const app = express();
const port = process.env["PORT"];

const userRoute = require("./routers/user.route");
const productRoute = require("./routers/product.route");
const orderRoute = require("./routers/order.route");
const postRoute = require("./routers/post.route");

app.use(cors());
app.use(express.json());


app.use('/api/users', userRoute);
app.use('/api/products', productRoute);
app.use('/api/orders', orderRoute);
app.use('/api/posts', postRoute);

const checkConnection = async () => {
  try {
    await prisma.$connect();
    await prisma.$queryRawUnsafe('SELECT 1');
    console.log("Database connected successfully");
    await prisma.$disconnect();
  } catch (err) {
    console.log('Database connection failed: ', err);
    process.exit(1);
  }
}
checkConnection();

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});