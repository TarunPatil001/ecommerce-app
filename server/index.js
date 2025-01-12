import express, { request, response } from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import connectDB from "./config/connectDb.js";
import userRouter from './route/user.route.js';

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
  // server to client
  response.json({
    message: "Server is running at " + process.env.PORT,
  });
});

app.use('/api/user', userRouter);


connectDB().then(()=>{
    app.listen(process.env.PORT, ()=>{
        console.log("Server is running at port ", process.env.PORT);
    })
})
