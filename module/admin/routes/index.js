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
const slugify = require("slugify")
const multer = require("multer");

const whitelist = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp'
]
const upload = multer({
  storage: multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
      const name = slugify(file.originalname, { lower: true })
      cb(null, `${new Date().getTime()}-${name}`)
    },
  }),
  fileFilter: (req, file, cb) => {
    if (!whitelist.includes(file.mimetype)) {
      return cb(new Error('file is not allowed'))
    }

    cb(null, true)
  }
})

const adminRoute = Router();


adminRoute.post(`/sign-up`,register);

adminRoute.post(`/login`,login);

//PROTECTED ROUTES
adminRoute.post(`/create-route`,authorizeAdmin, createRoute);

adminRoute.post(`/create-bus`,authorizeAdmin, createBus);

adminRoute.post(`/upload-bus-pic`,authorizeAdmin,upload.single("file"), uploadBus);

adminRoute.get(`/bus-booking-history`,authorizeAdmin, busBookingHistory);

adminRoute.patch(`/update-booking`,authorizeAdmin, updateBusBooking);

module.exports = adminRoute;
