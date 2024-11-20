const { StatusCodes } = require("http-status-codes");
const { response } = require("../../utils/response.util");
const BanSaoSach = require("../../models/bansaosach.model");
const Sach = require("../../models/sach.model");

const createBanSaoSach = async (req, res) => {
  try {
    const masach = req.params.id;
    const bansaosach = await BanSaoSach.create({ masach: masach });
    if (!bansaosach) {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        {},
        "Không thể tạo bản sao"
      );
    }

    const sach = await Sach.findById(masach);
    if (!sach) {
      await BanSaoSach.findByIdAndDelete(bansaosach._id); // Xóa bản sao sách vừa tạo
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        {},
        "Không tìm thấy sách"
      );
    }

    sach.soquyen += 1;
    await sach.save();

    return response(
      res,
      StatusCodes.CREATED,
      true,
      { sach, bansaosach },
      "Tạo bản sao thành công"
    );
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      error.message
    );
  }
};

const updateStatus = async (req, res) => {
  try {
    const mavach = req.params.id;
    const { sanco } = req.body;

    if (typeof sanco === "undefined") {
      return response(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        {},
        "Trạng thái 'sanco' không được cung cấp"
      );
    }

    // Cập nhật trạng thái của bản sao sách
    const updateStatusBanSaoSach = await BanSaoSach.findByIdAndUpdate(
      mavach,
      { sanco: sanco }, // Cập nhật giá trị của sanco
      { new: true } // Trả về tài liệu đã được cập nhật
    );

    if (!updateStatusBanSaoSach) {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        {},
        "Không tìm thấy bản sao"
      );
    }

    return response(
      res,
      StatusCodes.OK,
      true,
      { bansaosach: updateStatusBanSaoSach },
      "Cập nhật trạng thái bản sao thành công"
    );
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      error.message
    );
  }
};
const updateStatusBanSach = async (mavach, status) => {
  try {
    console.log(mavach);
    const updateStatusBanSaoSach = await BanSaoSach.findByIdAndUpdate(
      mavach,
      { sanco: status },
      { new: true }
    );
    if (!updateStatusBanSaoSach) {
      return false;
    }
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
const deleteBanSaoSach = async (req, res) => {
  try {
    const mabansaosach = req.params.id;
    const bansaosach = await BanSaoSach.findByIdAndDelete(mabansaosach);
    if (!bansaosach) {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        {},
        "Không tìm thấy bản sao"
      );
    }
    return response(
      res,
      StatusCodes.ACCEPTED,
      true,
      { bansaosach },
      "Xóa bản sao thành công"
    );
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      error.message
    );
  }
};
const getBanSaoSachById = async (req, res) => {
  try {
    const mavach = req.params.id;
    const bansaosach = await BanSaoSach.findById(mavach).populate(
      "masach",
      "tensach"
    );
    if (!bansaosach) {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        {},
        "Không tìm thấy bản sao"
      );
    }
    return response(
      res,
      StatusCodes.OK,
      true,
      bansaosach,
      "Lay ban sao sach thanh cong"
    );
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      error.message
    );
  }
};

module.exports = {
  createBanSaoSach,
  updateStatus,
  deleteBanSaoSach,
  getBanSaoSachById,
  updateStatusBanSach,
};
