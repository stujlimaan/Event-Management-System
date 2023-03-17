const express = require("express")
const router = express.Router()
const User = require("../controllers/userController")
const Event = require("../controllers/eventController")
const auth =require("../middleware/auth")

//all user api
router.post("/registration",User.userRegistration)
router.post("/login",User.userLogin)
router.get("/logout",auth.authentication,User.logout)
router.put("/changePassword",User.changePassword)
router.put("/updatePassword",auth.authentication,User.updatePassword)

//all event api
router.post("/createEvent",auth.authentication,Event.createEvent)
router.post("/invite/:eventId",auth.authentication,Event.inviteUser)
router.get("/list/:page",Event.list)
router.get("/eventDetails",Event.eventDetails)
router.put("/eventupdate/:eventId",Event.eventUpdate)



module.exports = router