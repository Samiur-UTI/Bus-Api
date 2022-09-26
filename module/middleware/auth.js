const jwt = require("jsonwebtoken");
const db = require("../model/index");
async function authorizeAdmin(req, res, next) {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      const valid = await jwt.verify(token, process.env.JWT_SECRET);
      const role = await db.user.findOne({
        where: {
          email: valid.email,
        },
        attributes: ["role"],
        raw: true,
      });
      console.log(role);
      if (role.role === "ADMIN") {
        next();
      } else {
        return {
          success: false,
          message: "Unauthorized Access request",
        };
      }
    }
    return {
      success: false,
      message: "Unauthorized access",
    };
  } catch (error) {
    throw new Error(error);
  }
}

async function authorizeCustomer(req, res, next) {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      const valid = await jwt.verify(token, process.env.JWT_SECRET);
      const role = await db.user.findOne({
        where: {
          email: valid.email,
        },
        attributes: ["role"],
        raw: true,
      });
      console.log(role);
      if (role.role === "CUSTOMER") {
        next();
      } else {
        return {
          success: false,
          message: "Unauthorized Access request",
        };
      }
    }
    return {
      success: false,
      message: "Unauthorized access",
    };
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  authorizeAdmin,
  authorizeCustomer,
};
