const { Router } = require("express");
const {
  createRoute,
  createBus,
  uploadBus,
  busBookingHistory,
  updateBusBooking,
} = require("../controller/index");

const adminRoute = Router();

const admin = "/admin";

adminRoute.post(`${admin}/sign-up`);

adminRoute.post(`${admin}/login`);

//PROTECTED ROUTES
adminRoute.post(`${admin}/create-route`, createRoute);

adminRoute.post(`${admin}/create-bus`, createBus);

adminRoute.post(`${admin}/upload-bus-pic`, uploadBus);

adminRoute.get(`${admin}/bus-booking-history`, busBookingHistory);

adminRoute.patch(`${admin}/update-booking`, updateBusBooking);

module.export = adminRoute;
