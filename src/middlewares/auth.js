// middlewares/auth.js
const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token não enviado." });
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Token mal formatado." });
  }

  try {
    const decoded = jwt.verify(token, jwtConfig.secret);
    req.user = decoded; // { id, ... }
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido ou expirado." });
  }
};