const express = require("express");
const app = express();
const connectDB = require("./control/db");
const productRoutes = require("./Routes/Product.routes");
const cartRoutes = require('./Routes/cartRoute');
const authRoutes=require('./Routes/UserRoute')
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
connectDB();

app.use(express.json());
app.use(cors());
app.use("/user", authRoutes);
app.use("/products", productRoutes);
app.use('/cart', cartRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
