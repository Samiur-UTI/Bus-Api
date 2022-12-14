const {
  registerService,
  loginService,
  createRouteService,
  createBusService,
  createBusTripService,
  uploadBusService,
  busBookingHistoryService,
  updateBusBookingService,
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
async function createRoute(req, res, next) {
  console.log("CREATE ROUTE --- ROUTE");
  try {
    return await createRouteService(req, res, next);
  } catch (error) {
    throw new Error("SOMETHING WENT WRONG");
  }
}
async function createBus(req, res, next) {
  console.log("CREATE BUS ROUTE --- ROUTE");
  try {
    return await createBusService(req, res, next);
  } catch (error) {
    throw new Error("SOMETHING WENT WRONG");
  }
}
async function createBusTrip(req, res, next) {
    console.log("CREATE BUS ROUTE --- ROUTE");
    try {
      return await createBusTripService(req, res, next);
    } catch (error) {
        console.log(error)
      throw new Error("SOMETHING WENT WRONG");
    }
  }
async function uploadBus(req, res, next) {
  console.log("Upload bus pic ROUTE --- ROUTE");
  try {
    return await uploadBusService(req, res, next);
  } catch (error) {
    throw new Error("SOMETHING WENT WRONG");
  }
}
async function busBookingHistory(req, res, next) {
  console.log("busBookingHistory ROUTE --- ROUTE");
  try {
    return await busBookingHistoryService(req, res, next);
  } catch (error) {
    console.log(error)
    throw new Error("SOMETHING WENT WRONG");
  }
}
async function updateBusBooking(req, res, next) {
  console.log("updateBusBooking ROUTE --- ROUTE");
  try {
    return await updateBusBookingService(req, res, next);
  } catch (error) {
    console.log(error)
    throw new Error("SOMETHING WENT WRONG");
  }
}

module.exports = {
  register,
  login,
  createRoute,
  createBus,
  createBusTrip,
  uploadBus,
  busBookingHistory,
  updateBusBooking,
};
