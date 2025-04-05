// routes/Signup.js
import express from "express";
import signupController from "../controller/Signup.js";  
const router = express.Router();
router.post("/", signupController);
// Export the router as the default export
export default router;
