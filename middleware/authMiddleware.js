const jwt = require("jsonwebtoken");
const Employee = require("../models/employeeModel");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach employee to request
      req.user = await Employee.findById(decoded.id).select("-password");

      next();
    } catch (err) {
      console.error(err);
      return res.status(401).json({ message: "Not authorized" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }
};

module.exports = { protect };
