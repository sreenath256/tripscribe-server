
const express = require("express");

const app = express()

const packageRoutes = require("../subRoutes/admin/packageRoutes");
const stayRoutes = require("../subRoutes/admin/stayRoutes");
const orderRoutes = require("../subRoutes/admin/orderRoutes");

const { requireAdminAuth } = require("../middlewares/authMiddleware");
const router = express.Router();


router.use("/api/packages", requireAdminAuth, packageRoutes);
router.use("/api/stays", requireAdminAuth, stayRoutes);
router.use("/api/orders", requireAdminAuth, orderRoutes);





module.exports = router;
