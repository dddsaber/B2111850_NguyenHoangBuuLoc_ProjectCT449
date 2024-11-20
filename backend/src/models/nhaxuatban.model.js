const mongoose = require("mongoose");

const nhaXuatBanSchema = mongoose.Schema(
  {
    tennxb: {
      type: String,
      required: true,
    },
    diachi: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const NhaXuatBan = mongoose.model("NhaXuatBan", nhaXuatBanSchema);

module.exports = { NhaXuatBan };
