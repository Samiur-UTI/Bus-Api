const { Router } = require("express");
const {
  register,
  login,
  createRoute,
  createBus,
  uploadBus,
  busBookingHistory,
  updateBusBooking,
} = require("../controller/index");


const adminRoute = Router();

const admin = "/admin";

adminRoute.post(`/sign-up`,register);

adminRoute.post(`/login`);

//PROTECTED ROUTES
adminRoute.post(`/create-route`, createRoute);

adminRoute.post(`/create-bus`, createBus);

adminRoute.post(`/upload-bus-pic`, uploadBus);

adminRoute.get(`/bus-booking-history`, busBookingHistory);

adminRoute.patch(`/update-booking`, updateBusBooking);

module.exports = adminRoute;
