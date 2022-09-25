const jwt = require("jsonwebtoken");
const db = require("../model/index");
async function authorizeAdmin(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const valid = await jwt.verify(token, process.env.JWT_SECRET);
    const role = await db.user.findOne({
        where:{
            email:valid.email
        },
        attributes:["role"],
        raw:true
    })
    if(role.role === "ADMIN"){
        next();
    }else{
        res.status(204).json({
            success:false,
            message:"Unauthorized Access request"
        })
    }
  } catch (error) {
    throw new Error(error)
  }
}

async function authorizeCustomer(req, res, next){
    try {
        const token = req.headers.authorization.split(" ")[1];
        const valid = await jwt.verify(token, process.env.JWT_SECRET);
        const role = await db.user.findOne({
            where:{
                email:valid.email
            },
            attributes:["role"],
            raw:true
        })
        if(role.role === "CUSTOMER"){
            next();
        }else{
            res.status(204).json({
                success:false,
                message:"Unauthorized Access request"
            })
        }
      } catch (error) {
        throw new Error(error)
      }
}

module.exports = {
    authorizeAdmin,
    authorizeCustomer
};
