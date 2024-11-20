const { StatusCodes } = require("http-status-codes");
const { response } = require("../../utils/response.util");
const { SachYeuThich } = require("../../models/sachyeuthich");

const getSachYeuThichById = async (req, res) => {
  try {
    const id = req.params.id;
    const sachYeuThich = await SachYeuThich.findById(id);
    if (!sachYeuThich) {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        {},
        "Sach yeu thich not found"
      );
    }
    return response(res, StatusCodes.OK, true, sachYeuThich, "Thanh cong");
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
const getSachYeuThichByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const sachYeuThich = await SachYeuThich.find({ userId });
    if (!sachYeuThich) {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        {},
        "Sach yeu thich not found"
      );
    }
    return response(res, StatusCodes.OK, true, sachYeuThich, "Thanh cong");
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
const updateSachYeuThich = async (req, res) => {
  try {
    const { userId, sachyeuthich } = req.body;
    const { id } = req.params;

    // Kiểm tra nếu không có dữ liệu cần thiết
    if (!userId || !sachyeuthich) {
      return response(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        {},
        "Thiếu thông tin cần thiết"
      );
    }

    // Tìm danh sách sách yêu thích của người dùng
    const oldSachYeuThich = await SachYeuThich.findOne({ manguoidung: userId });

    if (!oldSachYeuThich) {
      // Tạo mới danh sách nếu chưa tồn tại
      const newSachYeuThich = await SachYeuThich.create({
        manguoidung: userId,
        sachyeuthich,
      });

      return response(
        res,
        StatusCodes.CREATED,
        true,
        newSachYeuThich,
        "Danh sách sách yêu thích được tạo"
      );
    } else {
      // Kiểm tra tính hợp lệ của ID
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return response(
          res,
          StatusCodes.BAD_REQUEST,
          false,
          {},
          "ID không hợp lệ"
        );
      }

      // Cập nhật danh sách sách yêu thích
      const updatedSachYeuThich = await SachYeuThich.findByIdAndUpdate(
        id,
        { $set: { sachyeuthich } },
        { new: true }
      );

      if (!updatedSachYeuThich) {
        return response(
          res,
          StatusCodes.NOT_FOUND,
          false,
          {},
          "Không tìm thấy danh sách để cập nhật"
        );
      }

      return response(
        res,
        StatusCodes.OK,
        true,
        updatedSachYeuThich,
        "Danh sách sách yêu thích được cập nhật"
      );
    }
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
  getSachYeuThichByUserId,
  getSachYeuThichById,
  updateSachYeuThich,
};
