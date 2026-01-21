
const express = require("express");


const packageRoutes = require("../subRoutes/public/packageRoutes");
const stayRoutes = require("../subRoutes/public/stayRoutes");

const router = express.Router();


router.use("/api/packages", packageRoutes);
router.use("/api/stays", stayRoutes);



module.exports = router;
