const { Router } = require("express");
const {
  createDonGiaoSach,
  getAllDonGiaoSach,
  getDonGiaoSachById,
  updateDonGiaoSach,
  deleteDonGiaoSach,
  getDonGiaoSachByRefId,
} = require("../controllers/dongiaosach/dongiaosach.controller");

const router = Router();

router.post("/create", createDonGiaoSach);

router.get("/", getAllDonGiaoSach);

router.get("/:id", getDonGiaoSachById);

router.put("/update/:id", updateDonGiaoSach);

router.delete("/delete/:id", deleteDonGiaoSach);

router.get("/search", getDonGiaoSachByRefId);

module.exports = router;
