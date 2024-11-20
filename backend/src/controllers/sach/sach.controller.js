const { StatusCodes } = require("http-status-codes");
const { response } = require("../../utils/response.util");
const { Sach } = require("../../models/sach.model");
const BanSaoSach = require("../../models/bansaosach.model");

const getAllBanSaoSach = async (req, res) => {
  try {
    const masach = req.params.id;
    if (!masach) {
      return response(
        res,
        StatusCodes.BAD_REQUEST,
        true,
        { bansaosachs: [] },
        "Khong thay ma sach"
      );
    }

    const bansaosach = await BanSaoSach.find({ masach: masach });

    if (!bansaosach) {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        { bansaosachs: [] },
        "Khong tim thay ban sao sach"
      );
    }
    const sach = await Sach.findById(masach);
    const result = bansaosach.map((copy) => ({
      ...copy.toObject(),
      tensach: sach.tensach, // thêm tên sách vào bản sao
    }));
    return response(
      res,
      StatusCodes.OK,
      true,
      { bansaosach: result },
      "Lay danh sach ban sao sach thanh cong"
    );
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      true,
      { bansaosachs: [] },
      "Co loi xay ra"
    );
  }
};

const createSach = async (req, res) => {
  try {
    const { tensach, dongia, soquyen, ...objSach } = req.body;

    if (!tensach || !dongia || !soquyen) {
      return response(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        { sach: {} },
        "Vui long nhap day du thong tin"
      );
    }

    const sach = await Sach.create({
      tensach,
      dongia,
      soquyen,
      ...objSach,
    });

    if (!sach) {
      return response(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        { sach: {} },
        "Co loi xay ra"
      );
    }

    const banSaoPromises = [];
    for (let i = 0; i < soquyen; i++) {
      banSaoPromises.push(
        BanSaoSach.create({
          masach: sach._id,
          sanco: true,
        })
      );
    }

    await Promise.all(banSaoPromises);

    return response(
      res,
      StatusCodes.CREATED,
      true,
      { sach },
      "Them sach moi thanh cong"
    );
  } catch (error) {
    return response(
      res,
      StatusCodes.BAD_REQUEST,
      true,
      { sach: {} },
      `Error: ${error.message}`
    );
  }
};

const getSachById = async (req, res) => {
  try {
    const { id } = req.params;
    const sach = await Sach.findById(id);
    if (!sach) {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        true,
        { sach: {} },
        "Khong the cap nhat sach"
      );
    }
    return response(
      res,
      StatusCodes.ACCEPTED,
      true,
      { sach: sach },
      "Lay sach thanh cong"
    );
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      { sach: {} },
      error.message
    );
  }
};

const updateSach = async (req, res) => {
  const sach = req.body;
  const id = req.params.id;
  console.log(sach);
  try {
    if (!sach || !id) {
      return response(
        res,
        StatusCodes.BAD_REQUEST,
        true,
        { sach: {} },
        "Khong du du lieu"
      );
    }
    sach.updateAt = new Date();
    const updatedSach = await Sach.findByIdAndUpdate(id, sach, {
      new: true,
    }).exec();

    if (!updateSach) {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        true,
        { sach: {} },
        "Sach khong ton tai"
      ); // Sach not found in the database
    }
    return response(
      res,
      StatusCodes.ACCEPTED,
      true,
      { sach: updatedSach },
      "Cap nhat sach thanh cong"
    );
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      { sach: {} },
      error.message
    );
  }
};

const deleteSach = async (req, res) => {
  try {
    const id = req.params.id;
    const sach = await Sach.findByIdAndDelete(id);
    if (!sach) {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        true,
        { sach: {} },
        "Khong the xoa sach"
      );
    }
    return response(
      res,
      StatusCodes.ACCEPTED,
      true,
      { sach: sach },
      "Xoa sach thanh cong"
    );
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      { sach: {} },
      error.message
    );
  }
};

const getAllSach = async (req, res) => {
  try {
    const { searchKey, khoa, theloaicantim, sortBy, limit } = req.body;

    // Tạo điều kiện tìm kiếm
    const searchCondition = {};
    if (searchKey) {
      searchCondition.$or = [
        { tensach: { $regex: searchKey, $options: "i" } },
        { tacgia: { $regex: searchKey, $options: "i" } },
      ];
    }

    if (khoa !== undefined) {
      searchCondition.khoa = khoa;
    }

    if (theloaicantim && theloaicantim !== undefined) {
      searchCondition.theloai = { $in: theloaicantim };
    }

    // Đếm tổng số sách phù hợp với điều kiện
    const total = await Sach.countDocuments(searchCondition).exec();
    const sachsRecord = await Sach.find(searchCondition)
      .limit(limit ? limit : 100)
      .sort(sortBy ? { [sortBy.field]: sortBy.order } : { createdAt: -1 })
      .exec();

    const sachs = await Promise.all(
      sachsRecord.map(async (sach) => {
        const bansaosachs = await BanSaoSach.find({
          masach: sach._id,
          sanco: true,
        });

        return {
          ...sach.toObject(),
          sanco: bansaosachs.length,
        };
      })
    );

    return response(
      res,
      StatusCodes.ACCEPTED,
      true,
      { total, sachs },
      "Lay danh sach sach thanh cong"
    );
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      { sach: {} },
      `Loi xay ra: ${error.message}`
    );
  }
};

module.exports = {
  getAllBanSaoSach,
  createSach,
  updateSach,
  deleteSach,
  getSachById,
  getAllSach,
};
