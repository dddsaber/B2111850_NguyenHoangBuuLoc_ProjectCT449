const mongoose = require("mongoose");

const sachYeuThichSchema = mongoose.Schema(
  {
    manguoidung: {
      type: String,
      required: true,
      ref: "User",
    },
    sachyeuthich: [
      {
        masach: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "sach",
        },
      },
    ],
  },
  { timestamps: true }
);

const SachYeuThich = mongoose.model("SachYeuThich", sachYeuThichSchema);

module.exports = SachYeuThich;
