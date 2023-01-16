const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authUser = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    console.log("token:", token);
    const decoded = jwt.verify(token, "appSecret");
    console.log(decoded);
    const user = await User.findOne({
      _id: decoded._id,
    });
    console.log(user);
    if (!user) throw new Error("Please Authenticate");
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: error.message });
  }
};

module.exports = authUser;
