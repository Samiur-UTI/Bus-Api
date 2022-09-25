const bcrypt = require("bcrypt")
const db = require("../../model/index")
const jwt = require("jsonwebtoken")
async function registerService(req,res,next){
    const {email,password} = req.body
    const isRegistered = await db.user.findOne({
        where:{
            email:email
        },
        raw:true
    })
    if(!isRegistered){
        const {email,password,phone,first_name,last_name} = req.body
        const salt = await bcrypt.genSalt(12)
        const hash = await bcrypt.hash(password,salt)
        if(String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ) && password.length > 6){
            const response = await db.admin.create({
                first_name,
                last_name,
                phone,
                role: "ADMIN"
            })
            console.log(response)
            await db.user.create({
                email,
                password:hash,
                role:"ADMIN",
                user_id:response.dataValues.id
            })
            return res.status(200).json({
                success:true,
                message:"Successfully signed Up"
            })
        }else{
            res.status(400).json({
                success: false,
                message:"Invalid email address or short password"
            })
        }
    }else{
        res.status(400).json({
            success: false,
            message:"USER ALREADY REGISTERED"
        })
    }
}
async function loginService(req,res,next){
    const {email,password} = req.body
    const data = await db.user.findOne({
        where:{
            email
        },
        attributes:['email','password'],
        raw:true
    })
    if(!data){
        return res.status(400).json({
            success: false,
            message:"User not Registered"
        })
    }
    const isValid = await bcrypt.compare(password,data.password)
    if(isValid){
       return res.status(400).json({
        success: true,
        token:jwt.sign(data,process.env.JWT_SECRET,{
            expiresIn:"30m"
        }),
        message:"Token will expire in 30 minutes"
       })
    }
}
async function createRouteService(req,res,next){
    console.log(req.body)
    
}
async function createBusService(req,res,next){
    console.log(req.body)
    
}
async function uploadBusService(req,res,next){
    console.log(req.body)
    
}
async function busBookingHistoryService(req,res,next){
    console.log(req.body)
    
}
async function updateBusBookingService(req,res,next){
    console.log(req.body)
    
}

module.exports = {
    registerService,
    loginService,
    createRouteService,
    createBusService,
    uploadBusService,
    busBookingHistoryService,
    updateBusBookingService,
  }