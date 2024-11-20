const PASSWORD_DEFAULT = "Admin@123";
const adminAccountDefault = {
  password: PASSWORD_DEFAULT,
  activeStatus: true,
  userType: "admin",
  email: "admin@gmail.com",
  fullName: "Admin",
  gender: "male",
};
const TAX_RATE_VAC = 0.1;
const BOOK_SHOP_EMAIL = "nhbl.loc@gmail.com";
const BOOK_SHOP_PASSWORD = "fbjs cwie eswt zfjh";

// URL den form o frontend
const confirmationUrl = `http://localhost:3001/change-password`;

// Cấu hình email HTML với nút xác nhận
const htmlContentForConfirmPassword = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2 style="color: #333;">Xác nhận tài khoản của bạn</h2>
        <p>Chào mừng bạn đến với Book Shop!</p>
        <p>Vui lòng nhấn vào nút bên dưới để xác nhận tài khoản của bạn:</p>
        <a href="${confirmationUrl}" style="
          display: inline-block;
          padding: 10px 20px;
          margin-top: 20px;
          color: white;
          background-color: #28a745;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
        ">Xác nhận tài khoản</a>
        <p>Nếu bạn không tạo tài khoản này, vui lòng bỏ qua email này.</p>
      </div>
    `;

const TYPE_USER = {
  admin: "admin",
  user: "user",
  administrative: "administrative",
  sales: "sales",
};

const TYPE_USER_STR = {
  admin: "Quản trị",
  user: "Người dùng",
  administrative: "Quản trị văn phòng",
  sales: "Bán hàng",
};

const TRANGTHAI_MUONSACH = {
  dangchoxuly: "danchoxuly",
  dangvanchuyen: "dangvanchuyen",
  dangmuon: "dangmuon", // Con han muon sach
  hoanthanh: "hoanthanh",
  quahan: "quahan", // Het han muon sach
  giucho: "giucho",
  huybo: "huybo", // Doc gia huy bo don muon sach
  tuchoi: "tuchoi", // Thu thu tu choi don muon sach
};

const TRANGTHAI_MUONSACH_STR = {
  dangchoxuly: "Đang chờ xử lý",
  dangvanchuyen: "Đang vận chuyển",
  dangmuon: "Đang mượn", // Con han muon sach
  hoanthanh: "Hoàn thành",
  quahan: "Quá hạn", // Het han muon sach
  giucho: "Giu chỗ",
  huybo: "Hủy bỏ", // Doc gia huy bo don muon sach
};

const TRANGTHAI_VANCHUYEN = {
  chogiao: "chogiao",
  danggiao: "danggiao",
  giaothanhcong: "giaothanhcong",
  giaothatbai: "giaothatbai",
};

const TRANGTHAI_VANCHUYEN_STR = {
  chogiao: "Chờ giao",
  danggiao: "Đang giao",
  giaothanhcong: "Giao thành công",
  giaothatbai: "Giao thất bại",
};

const LOAIMUON = {
  tructiep: "tructiep",
  tructuyen: "tructuyen",
};

module.exports = {
  PASSWORD_DEFAULT,
  adminAccountDefault,
  TRANGTHAI_MUONSACH,
  TRANGTHAI_MUONSACH_STR,
  TRANGTHAI_VANCHUYEN,
  TRANGTHAI_VANCHUYEN_STR,
  LOAIMUON,
  htmlContentForConfirmPassword,
  BOOK_SHOP_EMAIL,
  BOOK_SHOP_PASSWORD,
  TYPE_USER,
  TYPE_USER_STR,
};
