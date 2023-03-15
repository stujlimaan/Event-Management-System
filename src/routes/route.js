const express = require("express")
const router = express.Router()
const User = require("../controllers/userController")

//all user api
router.post("/registration",User.userRegistration)
router.post("/login",User.userLogin)
router.get("/logout",User.logout)
router.put("/changePassword",User.changePassword)
router.put("/updatePassword",User.updatePassword)

//all event api


module.exports = router