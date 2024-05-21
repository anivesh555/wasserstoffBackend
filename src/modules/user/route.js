const express = require("express");
const router = express.Router();

const { verifyToken,
    verifyTokenAndUser} = require("../../middleware/auth");

const {getAllUser,
    registerUser,
    loginUser,
    reGenerateAccessToken,
    checkAuth
    } = require("./controller");

// router.get("/",isAuth,getAllUser)
router.post("/",registerUser)
router.post("/login",loginUser)
router.post("/renew",reGenerateAccessToken)
router.get("/auth",verifyToken,checkAuth)
router.get("/auth/admin",verifyTokenAndUser,checkAuth)







module.exports = router