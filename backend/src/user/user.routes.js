import {Router} from 'express'
import { createUser, login,sendEmail,forgotPassword ,verifyToken,changePassword,logout,getAllUsers,updateStatus} from './user.controller.js';
import { adminUserGuard, verifyTokenGuard } from '../Middleware/guard.middleware.js';


const userRouter=Router();

//@post api/users/signup
userRouter.post("/signup",createUser)
//@post api/users/login
userRouter.post("/login",login)

//@post api/users/logout
userRouter.get("/logout",logout)

//@post api/users/get
userRouter.get("/get", adminUserGuard, getAllUsers)
//@post api/users/status
userRouter.put("/status/:id", adminUserGuard, updateStatus)

//@post api/users/send-mail
userRouter.post("/send-mail",sendEmail)
//@post api/users/forgot-password
userRouter.post("/forgot-password",forgotPassword)
userRouter.post("/verify-token",verifyTokenGuard,verifyToken)
userRouter.put("/change-password",verifyTokenGuard,changePassword)
//@get api/users/session
userRouter.get("/session",adminUserGuard,(req,res)=>{
    return res.json( req.user)
})
export default userRouter