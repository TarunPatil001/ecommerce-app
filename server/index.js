import express, { request, response } from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import connectDB from "./config/connectDb.js";
import userRouter from './route/user.route.js';
import categoryRouter from "./route/category.route.js";
import productRouter from "./route/product.route.js";
import cartProductRouter from "./route/cartProduct.route.js";
import wishlistRouter from "./route/wishlist.route.js";
import { addAddressController } from "./controllers/address.controller.js";
import addressRouter from "./route/address.route.js";
// import addressRouter from "./route/address.route.js";

const app = express();

app.use(cors());
app.options("*", cors());

app.use(express.json());
app.use(cookieParser());
app.use(morgan());
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.get("/", (request, response) => {
  response.json({
    message: "Server is running at " + process.env.PORT,
  });
});

app.use('/api/user', userRouter);
app.use('/api/category', categoryRouter);
app.use('/api/product', productRouter);
app.use('/api/cartProduct', cartProductRouter);
app.use('/api/wishlist', wishlistRouter);
app.use('/api/address', addressRouter);


connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log("Server is running at port ", process.env.PORT);
  });
});
