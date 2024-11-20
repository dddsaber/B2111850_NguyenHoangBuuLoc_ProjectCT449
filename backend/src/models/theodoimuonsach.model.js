const mongoose = require("mongoose");

const theoDoiMuonSachSchema = mongoose.Schema(
  {
    mathethuvien: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "thethuvien",
    },
    mathuthu: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    ngaymuon: {
      type: Date,
      required: true,
    },
    ngaytradukien: {
      type: Date,
      required: true,
      default: null,
    },
    ngaytra: {
      type: Date,
    },
    loaimuon: {
      type: String,
      required: true,
      default: "tructiep",
    },
    trangthai: {
      type: String,
      required: true,
      default: "dangmuon",
    },
    sachmuon: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "BanSaoSach",
      },
    ],
    sachtra: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BanSaoSach",
        default: [],
      },
    ],
  },
  { timestamps: true }
);

const TheoDoiMuonSach = mongoose.model(
  "TheoDoiMuonSach",
  theoDoiMuonSachSchema
);

module.exports = { TheoDoiMuonSach };
