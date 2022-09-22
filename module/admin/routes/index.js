const {Router} = require('express')

const adminRoute = Router()

const admin = '/admin'

adminRoute.post(`${admin}/sign-up`,console.log("SIGN UP ROUTE"))

adminRoute.post(`${admin}/login`,console.log("LOGIN ROUTE"))


//PROTECTED ROUTES
adminRoute.post(`${admin}/create-route`,console.log("CREATE ROUTE --- ROUTE"))

adminRoute.post(`${admin}/create-bus`,console.log("CREATE BUS --- ROUTE"))

adminRoute.post(`${admin}/upload-bus-pic`,console.log("UPLOAD BUS PIC --- ROUTE"))

adminRoute.get(`${admin}/bus-booking-history`,console.log("BUS BOOKING HISTORY --- ROUTE"))

adminRoute.patch(`${admin}/update-booking`,console.log("BUS BOOKING UPDATE --------- ROUTE"))

module.export = adminRoute