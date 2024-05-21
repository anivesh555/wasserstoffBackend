const express = require('express')

const router = express.Router()

const userRoutes = require("../modules/user/route")
const imageRoutes = require("../modules/image/route")
const approvalRoutes = require("../modules/approval/route")


router.use('/user',userRoutes)
router.use('/image',imageRoutes)
router.use('/approve',approvalRoutes)





module.exports = router