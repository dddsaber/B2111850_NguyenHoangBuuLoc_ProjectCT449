const { StatusCodes } = require("http-status-codes");
const { response } = require("../../utils/response.util");
const { NhaXuatBan } = require("../../models/nhaxuatban.model");

const createNhaxuatBan = async (req, res) => {
  try {
    const { tennxb, diachi } = req.body;
    if (!tennxb || !diachi) {
      return response(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        { sach: {} },
        "Thieu thong tin"
      );
    }

    const oldNhaXuatBan = await NhaXuatBan.find({
      tennxb: { $regex: tennxb, $options: "i" },
    });

    if (oldNhaXuatBan) {
      return response(
        res,
        StatusCodes.CONFLICT,
        false,
        { nhaxuatban: {} },
        "Ten nha xuat ban da ton tai"
      );
    }

    const newNhaxuatBan = await NhaXuatBan.create({
      tennxb,
      diachi,
    });
    return response(
      res,
      StatusCodes.CREATED,
      true,
      { nhaxuatban: newNhaxuatBan },
      "Tao Nha Xuat Ban thanh cong"
    );
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      { sach: {} },
      "Internal Server Error: Unable to create new Nha Xuat Ban"
    );
  }
};

const getNhaxuatBanById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return response(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        { nhaxuatban: {} },
        "Khong co id"
      );
    }
    const nhaXuatBan = await NhaXuatBan.findById(id);
    if (!nhaXuatBan) {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        { nhaxuatban: {} },
        "Nha Xuat Ban khong ton tai"
      );
    }
    return response(
      res,
      StatusCodes.ACCEPTED,
      true,
      { nhaxuatban: nhaXuatBan },
      "Tim kiem thanh cong"
    );
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      { nhaxuatban: {} },
      error.message
    );
  }
};

const updateNhaxuatBan = async (req, res) => {
  try {
    const id = req.params.id;
    const newNhaXuatBan = req.body;
    if (!id || !newNhaXuatBan) {
      return response(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        { nhaxuatban: {} },
        "Khong co id hoac thong tin"
      );
    }

    const updatedNhaXuatBan = await NhaXuatBan.findOneAndUpdate(
      id,
      newNhaXuatBan,
      {
        new: true,
      }
    ).exec();

    if (!updatedNhaxuatBan) {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        { nhaxuatban: {} },
        "Khong the cap nhat"
      );
    }

    return response(
      res,
      StatusCodes.ACCEPTED,
      true,
      { nhaxuatban: updatedNhaXuatBan },
      "Cap nhat thanh cong"
    );
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      { nhaxuatban: {} },
      error.message
    );
  }
};

const deleteNhaxuatBan = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return response(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        { nhaxuatban: {} },
        "Khong co id"
      );
    }
    const deletedNhaxuatBan = await NhaXuatBan.findByIdAndDelete(id).exec();
    if (!deletedNhaxuatBan) {
      return response(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        { nhaxuatban: {} },
        "Khong the xoa"
      );
    }
    return response(
      res,
      StatusCodes.ACCEPTED,
      true,
      { nhaxuatban: deletedNhaxuatBan },
      "Xoa thanh cong"
    );
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      { nhaxuatban: {} },
      error.message
    );
  }
};

const getAllNhaxuatBans = async (req, res) => {
  try {
    const { searchKey, sortBy, limit } = req.body;
    const total = await NhaXuatBan.countDocuments().where(
      searchKey
        ? {
            $or: [
              {
                tennxb: { $regex: searchKey, $options: "i" },
              },
              {
                diachi: { $regex: searchKey, $options: "i" },
              },
            ],
          }
        : null
    );

    const nhaxuatbans = await NhaXuatBan.find()
      .where(
        searchKey
          ? {
              $or: [
                {
                  tennxb: { $regex: searchKey, $options: "i" },
                },
                {
                  diachi: { $regex: searchKey, $options: "i" },
                },
              ],
            }
          : null
      )
      .sort(sortBy ? { [sortBy.field]: [sortBy.order] } : { createdAt: -1 })
      .limit(limit ? limit : null);

    if (!nhaxuatbans || nhaxuatbans.length === 0) {
      return response(
        res,
        StatusCodes.ACCEPTED,
        false,
        { total: 0, nhaxuatbans: [] },
        "Khong co ket qua"
      );
    }

    return response(
      res,
      StatusCodes.ACCEPTED,
      true,
      { total, nhaxuatbans },
      "Danh sach nha xuat ban"
    );
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      { nhaxuatbans: [] },
      error.message
    );
  }
};

module.exports = {
  createNhaxuatBan,
  getNhaxuatBanById,
  updateNhaxuatBan,
  deleteNhaxuatBan,
  getAllNhaxuatBans,
};
