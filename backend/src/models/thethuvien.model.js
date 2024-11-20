const mongoose = require("mongoose");

const TheThuVienSchema = mongoose.Schema(
  {
    ngaygiahan: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    ngayhethan: {
      type: Date,
      required: true,
    },
    trangthai: {
      type: String,
      default: "conhieuluc",
    },
    docgia: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    lichsugiahan: [
      {
        ngaygiahan: {
          type: Date,
          required: true,
        },
        thoigiangiahan: {
          type: Number,
        },
        sotien: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

TheThuVienSchema.pre("find", async function (next) {
  const today = new Date();

  // Cập nhật trạng thái các thẻ có ngày hết hạn nhỏ hơn ngày hiện tại
  await TheThuVien.updateMany(
    { ngayhethan: { $lt: today }, trangthai: "conhieuluc" },
    { $set: { trangthai: "hethan" } }
  );

  next();
});
const TheThuVien = mongoose.model("TheThuVien", TheThuVienSchema);
module.exports = { TheThuVien };
