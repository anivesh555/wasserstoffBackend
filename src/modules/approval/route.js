const express = require("express");
const router = express.Router();
const {upload,errorHandlerMulter}  = require('./../../middleware/uploadPhotos')
const { verifyToken,verifyTokenAndUser } = require("../../middleware/auth");


const {
    getAllImages,
    reviewImages,
    exportCsv,
    exportPdf,
    exportPdfImage,
    exportUserCsv
    } = require("./controller");

// router.get("/",isAuth,getAllUser)
router.post("/",verifyTokenAndUser,getAllImages)
router.post("/review",verifyTokenAndUser,reviewImages)
router.get("/csv",verifyTokenAndUser,exportCsv)
router.get("/pdf",verifyTokenAndUser,exportPdfImage)
router.get("/user/pdf",verifyTokenAndUser,exportPdf)
router.get("/user/csv",verifyTokenAndUser,exportUserCsv)







module.exports = router