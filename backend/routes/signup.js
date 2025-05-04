import express from "express";
import signupController from "../controller/Signup.js";  

const router = express.Router();


router.post("/", signupController);

export default router;
