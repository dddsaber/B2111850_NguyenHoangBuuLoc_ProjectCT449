const { Router } = require("express");
const {
  getAllBanSaoSach,
  createSach,
  getAllSach,
  getSachById,
  updateSach,
  deleteSach,
} = require("../controllers/sach/sach.controller");
const { isAdmin } = require("../utils/protected.util");

const router = Router();
router.post("/create", createSach);

router.post("/", getAllSach);

router.get("/bansaosach/:id", getAllBanSaoSach);

router.get("/:id", getSachById);

router.put("/:id", isAdmin, updateSach);

router.delete("/:id", isAdmin, deleteSach);

module.exports = router;
