import { Router } from "express";
import {
  createTransaction,
  deleteTransaction,
  getTransaction,
  updateTransaction,
} from "./transaction.controller.js";
import { adminUserGuard } from "../Middleware/guard.middleware.js";


const TransactionRouter = Router();
TransactionRouter.post("/create",adminUserGuard,createTransaction);

TransactionRouter.put("/update/:id", adminUserGuard, updateTransaction);
TransactionRouter.delete("/delete/:id", adminUserGuard, deleteTransaction);
TransactionRouter.get("/get", adminUserGuard, getTransaction);

export default TransactionRouter