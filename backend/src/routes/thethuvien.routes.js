const { Router } = require("express");
const {
  createTheThuVien,
  giaHanThe,
  khoaThe,
  getTheThuVienByUserId,
} = require("../controllers/thethuvien/thethuvien.controller");

const router = Router();
router.get("/:id", getTheThuVienByUserId);
router.post("/", createTheThuVien); // Tạo thẻ thư viện
router.put("/renew", giaHanThe); // Gia hạn thẻ thư viện
router.put("/block", khoaThe); // Khóa thẻ thư viện

module.exports = router;
