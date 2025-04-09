import jwt from 'jsonwebtoken';

// Middleware to ensure the user is authenticated by verifying the JWT token
const requireAuth = (req, res, next) => {
  
  // Extract the Authorization header from the incoming request
  const authHeader = req.headers.authorization;

  // Check if the Authorization header exists and starts with "Bearer"
  if (!authHeader || !authHeader.startsWith("Bearer "))
  {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Extract the token from the Authorization header
  const token = authHeader.split(" ")[1];

  try 
  {
    // Verify the JWT token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded user data to the request object for use in subsequent routes
    req.user = decoded; 
    
    next();
  }
   catch (error) {
    console.error("JWT verification error:", error);
    return res.status(401).json({ message: "Invalid token" });
  } 
};

export default requireAuth;
