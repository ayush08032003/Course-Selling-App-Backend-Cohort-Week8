const jwt = require("jsonwebtoken");
const JWT_USER_PASSWORD = process.env.JWT_USER_PASSWORD;

const authUser = (req, res, next) => {
  const token = req.headers.token;
  // console.log(token);

  try {
    const decode = jwt.verify(token, JWT_USER_PASSWORD);
    if (decode) {
      req.userId = decode.userId;
      next();
    } else {
      res.status(401).json({
        message: "Unauthorized User Access",
      });
    }
  } catch (error) {
    res.status(401).json({
      message: "Unauthorized User Access",
    });
  }
};

module.exports = { authUser, JWT_USER_PASSWORD };
