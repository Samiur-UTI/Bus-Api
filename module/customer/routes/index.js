const { Router } = require("express");
const {
  register,
  login,
  allTrip,
  bookBus,
  busBookingHistory
} = require("../controller/index");
const {authorizeCustomer} = require("../../middleware/auth")

const customerRoute = Router();


customerRoute.post(`/sign-up`,register);

customerRoute.post(`/login`,login);

//PROTECTED ROUTES
customerRoute.get(`/alltrip`,authorizeCustomer, allTrip);

customerRoute.post(`/book-bus`,authorizeCustomer, bookBus);

// customerRoute.post(`/upload-bus-pic`,authorizeCustomer,upload.single("file"), uploadBus);

customerRoute.get(`/bus-booking-history`,authorizeCustomer, busBookingHistory);

// customerRoute.patch(`/update-booking`,authorizeCustomer, updateBusBooking);

module.exports = customerRoute;
 