const {
  registerService,
  loginService,
  allTripService,
  bookBusService,
  busBookingHistoryService,
} = require("../service/index");
async function register(req, res, next) {
  console.log("REGISTER ROUTE --- ROUTE");
  try {
    return await registerService(req, res, next);
  } catch (error) {
    console.log(error);
    throw new Error("SOMETHING WENT WRONG");
  }
}
async function login(req, res, next) {
  console.log("Login ROUTE --- ROUTE");
  try {
    return await loginService(req, res, next);
  } catch (error) {
    throw new Error("SOMETHING WENT WRONG");
  }
}
async function allTrip(req, res, next) {
  console.log("CREATE ROUTE --- ROUTE");
  try {
    return await allTripService(req, res, next);
  } catch (error) {
    console.log(error);
    throw new Error("SOMETHING WENT WRONG");
  }
}
async function bookBus(req, res, next) {
  console.log("CREATE BUS ROUTE --- ROUTE");
  try {
    return await bookBusService(req, res, next);
  } catch (error) {
    console.log(error);
    throw new Error("SOMETHING WENT WRONG");
  }
}
async function busBookingHistory(req, res, next) {
  console.log("busBookingHistory ROUTE --- ROUTE");
  try {
    return await busBookingHistoryService(req, res, next);
  } catch (error) {
    console.log(error);
    throw new Error("SOMETHING WENT WRONG");
  }
}

module.exports = {
  register,
  login,
  allTrip,
  bookBus,
  busBookingHistory,
};
