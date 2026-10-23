const express = require("express");
const cors = require("cors");

const app = express();
const port = 3000;

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


app.listen(port, () => {
  console.log(`Server runing on ${port}`);
});