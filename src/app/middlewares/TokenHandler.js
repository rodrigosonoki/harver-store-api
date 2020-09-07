const jwt = require("jsonwebtoken");
const User = require("../models/User");

//MIDDLEWARE TO VALIDATE TOKEN
exports.validateToken = (req, res, next) => {
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

exports.isAdmin = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) return res.status(401).json({ msg: "Acesso negado." });

  try {
    const verified = jwt.verify(token, process.env.SECRET_TOKEN);
    const user = await User.findById(verified.id);
    if (user.role !== "admin") {
      return res.status(400).json({ msg: "Acesso negado" });
    }
    next();
  } catch (err) {
    return res.status(400).json({ msg: "Acesso negado." });
  }
};
