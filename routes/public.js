
const express = require("express");


const packageRoutes = require("../subRoutes/public/packageRoutes");
const stayRoutes = require("../subRoutes/public/stayRoutes");

const router = express.Router();


router.use("/packages", packageRoutes);
router.use("/stays", stayRoutes);



module.exports = router;
