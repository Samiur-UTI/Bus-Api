const bcrypt = require("bcrypt");
const db = require("../../model/index");
const jwt = require("jsonwebtoken");

async function registerService(req, res, next) {
  const { email } = req.body;
  const isRegistered = await db.user.findOne({
    where: {
      email: email,
    },
    raw: true,
  });
  if (!isRegistered) {
    const { password, phone, first_name, last_name } = req.body;
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
      const response = await db.customer.create({
        first_name,
        last_name,
        phone,
      });
      await db.user.create({
        email,
        password: hash,
        role: "CUSTOMER",
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
    attributes: ["email", "password", "id"],
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
      userId: data.id,
      message: "Token will expire in 30 minutes",
    });
  }
}
async function allTripService(req, res, next) {
  const data = await db.bus_route_search.findAll({
    where: {
      trip_status: "ON",
    },
    raw: true,
  });
  if (data.length) {
    let response = await Promise.all(
      data.map(async (item) => {
        const preparedResponse = {};
        preparedResponse["price"] = item.price;
        preparedResponse["dep"] = item.dep;
        preparedResponse["arr"] = item.arr;
        preparedResponse["seats"] = await db.bus.findOne({
          where: {
            id: item.bus_id,
          },
          attributes: ["seats_available"],
          raw: true,
        });
        return preparedResponse;
      })
    );
    response = response.map((r) => {
      return {
        price: r.price,
        dep: r.dep,
        arr: r.arr,
        seats: r.seats.seats_available,
      };
    });
    return res.status(200).json({
      success: true,
      data: response,
    });
  } else {
    res.status(400).json({
      success: false,
      message: "No available trip found",
    });
  }
}
async function bookBusService(req, res, next) {
  if (req.query.user_id && req.query.bus_route_search_id) {
    const { user_id, bus_route_search_id } = req.query;
    const response = await db.bus_route_search.findOne({
      where: {
        id: bus_route_search_id,
      },
      attributes: ["price"],
      raw: true,
    });
    if (response) {
      const paid = Number(req.body.amount_paid);
      const seats = req.body.seats;
      const amount_due = Number(response.price) - paid;
      const busBookingHistory = {
        booking_id: user_id,
        bus_route_search_id,
        status: "BOOKED",
        amount_paid: paid,
        amount_due,
        seats,
      };
      await db.bus_booking_history.create(busBookingHistory);
      return res.status(200).json({
        success: true,
        message: "Booking Successfull!",
      });
    }
  }
  return {
    success: false,
    message: "Please Check your given inputs!",
  };
}
async function busBookingHistoryService(req, res, next) {
  if (req.query.userId) {
    const data = await db.bus_booking_history.findAll({
      where: {
        booking_id: req.query.userId,
      },
      raw: true,
    });
    if (data.length) {
      return res.status(200).json({
        success: true,
        data: data,
      });
    }
  }
  return {
    success: false,
    message: "Please Check your given inputs!",
  };
}

module.exports = {
  registerService,
  loginService,
  allTripService,
  bookBusService,
  busBookingHistoryService,
};
