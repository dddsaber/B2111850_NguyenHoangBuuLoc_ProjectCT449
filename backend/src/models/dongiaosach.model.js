const mongoose = require("mongoose");

const donGiaoSachSchema = mongoose.Schema(
  {
    matheodoimuonsach: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "TheoDoiMuonSach",
    },
    mavanchuyen: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    trangthai: {
      type: String,
      required: true,
    },
    ngaygiaodukien: {
      type: Date,
      required: true,
    },
    ngaygiao: {
      type: Date,
      required: true,
    },
    diachi: {
      type: String,
      required: true,
    },
    sodienthoai: {
      type: String,
      required: true,
    },
    ghichu: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);
