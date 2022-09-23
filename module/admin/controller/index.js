
async function createRoute(req,res,next){
    console.log("CREATE ROUTE --- ROUTE")
    try {
        res.status(200).json({})
    } catch (error) {
        throw new Error("SOMETHING WENT WRONG")
    }
}
async function createBus(req,res,next){
    console.log("CREATE ROUTE --- ROUTE")
    try {
        res.status(200).json({})
    } catch (error) {
        throw new Error("SOMETHING WENT WRONG")
    }
}
async function uploadBus(req,res,next){
    console.log("CREATE ROUTE --- ROUTE")
    try {
        res.status(200).json({})
    } catch (error) {
        throw new Error("SOMETHING WENT WRONG")
    }
}
async function busBookingHistory(req,res,next){
    console.log("CREATE ROUTE --- ROUTE")
    try {
        res.status(200).json({})
    } catch (error) {
        throw new Error("SOMETHING WENT WRONG")
    }
}
async function updateBusBooking(req,res,next){
    console.log("CREATE ROUTE --- ROUTE")
    try {
        res.status(200).json({})
    } catch (error) {
        throw new Error("SOMETHING WENT WRONG")
    }
}

module.exports = {
    createRoute,
    createBus,
    uploadBus,
    busBookingHistory,
    updateBusBooking
}