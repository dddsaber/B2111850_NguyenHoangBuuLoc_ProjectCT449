const { response } = require("express");
const mongoose = require("mongoose");

const banSaoSachSchema = mongoose.Schema(
  {
    masach: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Sach",
    },
    sanco: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true }
);

const BanSaoSach = mongoose.model("BanSaoSach", banSaoSachSchema);

module.exports = BanSaoSach;
