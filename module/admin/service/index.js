const bcrypt = require("bcrypt");
const db = require("../../model/index");
const jwt = require("jsonwebtoken");
const { raw } = require("body-parser");
const { request } = require("express");

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
  } else {
    res.status(400).json({
      success: false,
      message: "Pleas check your given inputs",
    });
  }
}
async function createBusService(req, res, next) {
  if (
    req.body.hasOwnProperty("company_name") &&
    req.body.hasOwnProperty("license_number") &&
    req.body.hasOwnProperty("seats_available")
  ) {
    const response = await db.bus.create(req.body);
    if (!response) {
      return res.status(400).json({
        success: false,
        message: "Failed to create bus data",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Bus info created successfully",
    });
  }
  return res.status(400).json({
    success: true,
    message: "Please check your given parameters",
  });
}
async function createBusTripService(req, res, next) {
  if (
    req.body.hasOwnProperty("dep") &&
    req.body.hasOwnProperty("arr") &&
    req.body.hasOwnProperty("from") &&
    req.body.hasOwnProperty("to") &&
    req.body.hasOwnProperty("license_number") &&
    req.body.hasOwnProperty("price")
  ) {
    const routeCheck = await db.route.findOne({
      where: {
        from: req.body.from,
        to: req.body.to,
        status: "ACTIVE",
      },
      attributes: ["id"],
      raw: true,
    });
    if (routeCheck) {
      const busCheck = await db.bus.findOne({
        where: {
          license_number: req.body.license_number,
        },
        attributes: ["id"],
        raw: true,
      });
      if (busCheck) {
        const item = {};
        item["route_id"] = routeCheck.id;
        item["bus_id"] = busCheck.id;
        item["dep"] = Date.now();
        item["arr"] = Date.now();
        item["price"] = req.body.price;
        await db.bus_route_search.create(item);
        return res.status(200).json({
          success: true,
          message: "Successfully created trips!",
        });
      }
    }
  }
  return res.status(400).json({
    success: true,
    message: "Please check your given parameters",
  });
}
async function uploadBusService(req, res, next) {
  const path = req.file.path;
  const id = req.query.id;
  const response = await db.bus.update(
    { image: path },
    {
      where: {
        id: id,
      },
      raw: true,
    }
  );
  if (response) {
    return res.status(200).json({
      success: true,
      message: "Successfully uploaded bcreateBusTripService",
    });
  }
  return res.status(400).json({
    success: false,
    message: "Failed to upload bus pic",
  });
}
async function busBookingHistoryService(req, res, next) {
  const data = await db.bus_booking_history.findAll({
    where: {
      status: "BOOKED",
    },
    raw: true,
  });
  if (data.length) {
    return res.status(200).json({
      success: true,
      data: data,
    });
  }
  return res.status(400).json({
    success: false,
    message: "No active trip found, bad business :(",
  });
}
async function updateBusBookingService(req, res, next) {
  const response = await db.bus_booking_history.update(
    {
      status: req.body.status,
      amount_paid: req.body.amount_paid,
      amount_due: req.body.amount_due,
    },
    {
      where: {
        id: req.query.booking_id,
      },
      raw: true,
    }
  );
  if (response[0]) {
    const brsId = await db.bus_booking_history.findOne({
      where: {
        id: response[0],
      },
      attributes: ["bus_route_search_id", "seats"],
      raw: true,
    });
    const busId = await db.bus_route_search.findOne({
      where: {
        id: brsId.bus_route_search_id,
      },
      attributes: ["bus_id"],
      raw: true,
    });
    const oldSeats = await db.bus.findOne({
      where: {
        id: busId.bus_id,
      },
      attributes: ["seats_available"],
      raw: true,
    });
    const currentSeats = oldSeats.seats_available - brsId.seats;
    await db.bus.update(
      {
        seats_available: currentSeats,
      },
      {
        where: {
          id: busId.bus_id,
        },
        raw: true,
      }
    );
    return res.status(200).json({
      success: true,
      message: "Successfully Updated booking status",
    });
  }
  return res.status(400).json({
    success: false,
    message: "Couldn't update booking,try later",
  });
}

module.exports = {
  registerService,
  loginService,
  createRouteService,
  createBusService,
  createBusTripService,
  uploadBusService,
  busBookingHistoryService,
  updateBusBookingService,
};
