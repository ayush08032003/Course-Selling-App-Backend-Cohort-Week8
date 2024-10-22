const jwt = require("jsonwebtoken");
const JWT_ADMIN_PASSWORD = process.env.JWT_ADMIN_PASSWORD;

const authAdmin = (req, res, next) => {
  const token = req.headers.token;
  // console.log(token)
  try {
    const decode = jwt.verify(token, JWT_ADMIN_PASSWORD);
    if (decode) {
      req.adminId = decode.adminId;
      next();
    } else {
      res.status(401).json({
        message: "Unauthorized Admin Access",
      });
    }
  } catch (error) {
    res.status(401).json({
      message: "Unauthorized Admin Access",
    });
  }
};

module.exports = { authAdmin, JWT_ADMIN_PASSWORD };
