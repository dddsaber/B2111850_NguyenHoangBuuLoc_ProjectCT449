const {
  getSachYeuThichByUserId,
  getSachYeuThichById,
  updateSachYeuThich,
} = require("../controllers/sachyeuthich/sachyeuthich.controller");

const { Router } = require("express");
const router = new Router();

router.get("user/:uid", getSachYeuThichByUserId);
router.get("/:id", getSachYeuThichById);
router.put("update/:id", updateSachYeuThich);

module.exports = router;
