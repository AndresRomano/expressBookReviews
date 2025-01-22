const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// Setup session middleware
app.use(
  session({
    secret: "access", // Match this with the secret used for signing JWT
    resave: true,
    saveUninitialized: true,
  })
);

// Authentication middleware for protected routes
app.use("/customer/auth/*", function auth(req, res, next) {
  if (!req.session.authorization || !req.session.authorization.accessToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Verify the access token stored in the session
    const decoded = jwt.verify(req.session.authorization.accessToken, "access");
    req.user = decoded; // Attach decoded user data to the request
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    req.session.destroy(); // Clear session if token is invalid
    return res.status(401).json({ error: "Unauthorized" });
  }
});

const PORT = 5000;

// Route handling
app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
