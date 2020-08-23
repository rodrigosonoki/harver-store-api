const jwt = require("jsonwebtoken");

//MIDDLEWARE TO VALIDATE TOKEN
const validateToken = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) return res.status(401).json({ error: "Access denied" });

  try {
    const verified = jwt.verify(token, process.env.SECRET_TOKEN);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: "Token is not valid" });
  }
};
module.exports = validateToken;
