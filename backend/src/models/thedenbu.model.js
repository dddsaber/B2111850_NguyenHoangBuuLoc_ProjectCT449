const mongoose = require("mongoose");

const TheDenBuSchema = mongoose.Schema(
  {
    mathethuvien: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TheThuVien",
    },
    sachdenbu: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BanSaoSach",
    },
    sotien: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

const TheDenBu = mongoose.model("TheDenBu", TheDenBuSchema);

module.exports = { TheDenBu };
