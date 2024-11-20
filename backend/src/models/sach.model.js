const mongoose = require("mongoose");

const sachSchema = new mongoose.Schema(
  {
    tensach: {
      type: String,
      required: true,
    },
    dongia: {
      required: true,
      type: Number,
    },
    soquyen: {
      required: true,
      type: Number,
      defaultValue: 0,
    },
    chomuon: {
      type: Boolean,
      required: true,
      default: true,
    },
    namxuatban: {
      type: Date,
    },
    image: {
      type: String,
    },
    manxb: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NhaXuatBan",
    },
    tacgia: {
      type: String,
    },
    khoa: {
      type: Boolean,
      required: true,
      default: false,
    },
    gioithieu: {
      type: String,
      default: "Chưa có giới thiệu",
    },
    theloai: {
      type: String,
      default: "Khác",
    },
  },
  { timestamps: true }
);

const Sach = mongoose.model("Sach", sachSchema);

module.exports = { Sach };
