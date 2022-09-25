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
const {authorizeAdmin} = require("../../middleware/auth")


const adminRoute = Router();


adminRoute.post(`/sign-up`,register);

adminRoute.post(`/login`,login);

//PROTECTED ROUTES
adminRoute.post(`/create-route`,authorizeAdmin, createRoute);

adminRoute.post(`/create-bus`,authorizeAdmin, createBus);

adminRoute.post(`/upload-bus-pic`,authorizeAdmin, uploadBus);

adminRoute.get(`/bus-booking-history`,authorizeAdmin, busBookingHistory);

adminRoute.patch(`/update-booking`,authorizeAdmin, updateBusBooking);

module.exports = adminRoute;
