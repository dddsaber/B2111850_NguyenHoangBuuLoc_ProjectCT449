const { Router } = require("express");
const {
  createTheoDoiMuonSach,
  getAllTheoDoiMuonSach,
  getTheoDoiMuonSachById,
  deleteTheoDoiMuonSach,
  getTheoDoiMuonSachByRefId,
  updateTheoDoiMuonSach,
  updateTrangThaiTDMS,
  getTheoDoiMuonSachByUserId,
  createTheoDoiMuonSachOnline,
} = require("../controllers/theodoimuonsach/theodoimuonsach.controller");

const router = Router();

router.post("/create", createTheoDoiMuonSach);
router.post("/create-online", createTheoDoiMuonSachOnline);
router.delete("/delete/:id", deleteTheoDoiMuonSach);
router.post("/", getAllTheoDoiMuonSach);
router.get("/:id", getTheoDoiMuonSachById);
router.get("/search", getTheoDoiMuonSachByRefId);
router.put("/update/:id", updateTheoDoiMuonSach);
router.put("/update-trang-thai/:id", updateTrangThaiTDMS);
router.get("/user/:userId", getTheoDoiMuonSachByUserId);
module.exports = router;
