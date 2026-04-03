
const express = require("express");

const app = express()

const packageRoutes = require("../subRoutes/admin/packageRoutes");
const stayRoutes = require("../subRoutes/admin/stayRoutes");
const orderRoutes = require("../subRoutes/admin/orderRoutes");

const { requireAdminAuth } = require("../middlewares/authMiddleware");
const router = express.Router();


router.use("/packages", packageRoutes);
router.use("/stays", stayRoutes);
router.use("/orders", orderRoutes);





module.exports = router;
