const { Router } = require("express");
const {
  createBanSaoSach,
  updateStatus,
  deleteBanSaoSach,
  getBanSaoSachById,
} = require("../controllers/bansaosach/bansaosach.controller");

const { isAdmin } = require("../utils/protected.util");
const router = Router();

router.post("/create", isAdmin, createBanSaoSach);
router.put("/update/:id", updateStatus);
router.get("/:id", getBanSaoSachById);
router.delete("/delete/:id", isAdmin, deleteBanSaoSach);
module.exports = router;
