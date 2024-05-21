const express = require("express");
const router = express.Router();
const {upload,errorHandlerMulter}  = require('./../../middleware/uploadPhotos')
const { verifyToken,verifyTokenAndUser } = require("../../middleware/auth");

// const isAuth = require("../../middleware/auth");

const {
    getAnnotations
    } = require("./controller");

// router.get("/",isAuth,getAllUser)
router.post("/",verifyToken,upload.single('image'),errorHandlerMulter,getAnnotations)




module.exports = router