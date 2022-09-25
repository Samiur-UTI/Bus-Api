const bcrypt = require("bcrypt");
const db = require("../../model/index");
const jwt = require("jsonwebtoken");

async function registerService(req, res, next) {
  const { email, password } = req.body;
  const isRegistered = await db.user.findOne({
    where: {
      email: email,
    },
    raw: true,
  });
  if (!isRegistered) {
    const { email, password, phone, first_name, last_name } = req.body;
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(password, salt);
    if (
      String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ) &&
      password.length > 6
    ) {
      const response = await db.admin.create({
        first_name,
        last_name,
        phone,
        role: "ADMIN",
      });
      console.log(response);
      await db.user.create({
        email,
        password: hash,
        role: "ADMIN",
        user_id: response.dataValues.id,
      });
      return res.status(200).json({
        success: true,
        message: "Successfully signed Up",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid email address or short password",
      });
    }
  } else {
    res.status(400).json({
      success: false,
      message: "USER ALREADY REGISTERED",
    });
  }
}
async function loginService(req, res, next) {
  const { email, password } = req.body;
  const data = await db.user.findOne({
    where: {
      email,
    },
    attributes: ["email", "password"],
    raw: true,
  });
  if (!data) {
    return res.status(400).json({
      success: false,
      message: "User not Registered",
    });
  }
  const isValid = await bcrypt.compare(password, data.password);
  if (isValid) {
    await db.user.update(
      { isActive: "TRUE" },
      {
        where: {
          email: data.email,
        },
      }
    );
    return res.status(400).json({
      success: true,
      token: jwt.sign(data, process.env.JWT_SECRET, {
        expiresIn: "30m",
      }),
      message: "Token will expire in 30 minutes",
    });
  }
}
async function createRouteService(req, res, next) {
  if (req.body.from && req.body.to) {
    const response = await db.route.create(req.body);
    if (response) {
      res.status(200).json({
        success: true,
        message: "Successfully created route",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Failed to add route",
      });
    }
  }else{
    res.status(400).json({
        success: false,
        message:"Pleas check your given inputs"
    })
  }
}
async function createBusService(req, res, next) {
  if(req.body.hasOwnProperty("company_name") && req.body.hasOwnProperty("license_number") && req.body.hasOwnProperty("seats_available")){
    const response = await db.bus.create(req.body)
    if(!response){
        return res.status(400).json({
            success:false,
            message:"Failed to create bus data"
        })
    }
    return res.status(200).json({
        success:true,
        message:"Bus info created successfully"
    })
  }
}
async function uploadBusService(req, res, next) {
  const path = req.file.path;
  const id = req.query.id
  const response = await db.bus.update({image:path},{
    where:{
        id:id
    },
    raw:true
  })
  if(response){
    return res.status(200).json({
        success:true,
        message:"Successfully uploaded bus pic"
    })
  }
  return res.status(400).json({
    success:false,
    message:"Failed to upload bus pic"
})
}
async function busBookingHistoryService(req, res, next) {}
async function updateBusBookingService(req, res, next) {
  console.log(req.body);
}

module.exports = {
  registerService,
  loginService,
  createRouteService,
  createBusService,
  uploadBusService,
  busBookingHistoryService,
  updateBusBookingService,
};
