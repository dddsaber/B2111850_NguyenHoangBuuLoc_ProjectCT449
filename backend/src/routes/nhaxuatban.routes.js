const { Router } = require("express");

const {
  createNhaxuatBan,
  getAllNhaxuatBans,
  getNhaxuatBanById,
  updateNhaxuatBan,
  deleteNhaxuatBan,
} = require("../controllers/nhaxuatban/nhaxuatban.controller");

const router = new Router();

router.post("/create", createNhaxuatBan);

router.get("/", getAllNhaxuatBans);

router.get("/:id", getNhaxuatBanById);

router.put("/update/:id", updateNhaxuatBan);

router.delete("/delete/:id", deleteNhaxuatBan);

module.exports = router;
