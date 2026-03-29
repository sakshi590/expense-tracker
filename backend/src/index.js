import express from "express";
import morgan from "morgan";
import userRouter from "./user/user.routes.js";
import TransactionRouter from "./transaction/transaction.route.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dashboardRouter from "./Dashboard/dashboard.routes.js";

dotenv.config();
const app = express();
app.listen(3030, () => {
  console.log("Server is running on port :3030");
});

//database connection

mongoose.connect(process.env.DB_URL)
.then(()=>{
    console.log("Database connected")
})
.catch(()=>{
    console.log("Database not connected")
})
app.use(cookieParser())
app.use(cors({
    origin:process.env.DOMAIN,
    credentials:true,
    
}))
//app level middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// route level middleware
app.use("/api/user", userRouter);
app.use("/api/transaction",TransactionRouter)
app.use("/api/dashboard",dashboardRouter)
