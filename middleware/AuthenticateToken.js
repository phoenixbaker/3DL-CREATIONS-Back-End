const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const token = req.headers["x-auth-token"];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (err, res) => {
    if (err) return res.sendStatus(403);
    req.user = res.user;
    next();
  });
}

module.exports = authenticateToken;
