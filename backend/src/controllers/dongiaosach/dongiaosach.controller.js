const { StatusCodes } = require("http-status-codes");
const { response } = require("../../utils/response.util");
const { DonGiaoSach } = require("../../models/dongiaosach.model");

const createDonGiaoSach = async (req, res) => {
  try {
    const dongiaosach = await req.body;
    if (
      dongiaosach.matheodoimuonsach === undefined ||
      dongiaosach.mavanchuyen === undefined
    ) {
      return response(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        {},
        "Matheodoimuonsach khong duoc de trong"
      );
    }
    const newDonGiaoSach = await DonGiaoSach.create(dongiaosach);
    if (!newDonGiaoSach) {
      return response(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        {},
        "Khong tao duoc don giao sach moi"
      );
    }
    return response(
      res,
      StatusCodes.CREATED,
      true,
      newDonGiaoSach,
      "Tao don giao sach thanh cong"
    );
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      "Khong tao duoc don giao sach moi"
    );
  }
};

const getAllDonGiaoSach = async (req, res) => {
  try {
    const { trangthai, sodienthoai, diachi, limit, sortBy } = req.body;
    const total = await DonGiaoSach.countDocuments()
      .where(trangthai !== undefined ? { trangthai } : null)
      .where(sodienthoai !== undefined ? { sodienthoai } : null)
      .where(diachi !== undefined ? { diachi } : null);
    const dongiaosachs = await DonGiaoSach.find()
      .where(trangthai !== undefined ? { trangthai } : null)
      .where(sodienthoai !== undefined ? { sodienthoai } : null)
      .where(diachi !== undefined ? { diachi } : null)
      .sort(sortBy ? { [sortBy.field]: [sortBy.order] } : { createAt: -1 })
      .limit(limit ? limit : null);
    return response(
      res,
      StatusCodes.OK,
      true,
      { dongiaosachs: dongiaosachs, total: total },
      "Lay danh sach thanh cong"
    );
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      "Khong lay duoc danh sach don giao sach"
    );
  }
};

const getDonGiaoSachById = async (req, res) => {
  try {
    const dongiaosach = await DonGiaoSach.findById(req.params.id);
    if (!dongiaosach) {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        {},
        "Don giao sach khong ton tai"
      );
    }
    return response(res, StatusCodes.OK, true, dongiaosach, "Thanh cong");
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      "Khong lay duoc don giao sach"
    );
  }
};

const updateDonGiaoSach = async (req, res) => {
  try {
    const id = req.params.id;
    const dongiaosach = req.body;
    if (!dongiaosach) {
      return response(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        {},
        "Khong co du lieu cap nhat"
      );
    }
    dongiaosach.updateAt = new Date();
    const newDonGiaoSach = await DonGiaoSach.findByIdAndUpdate(
      id,
      dongiaosach,
      { new: true }
    );
    if (!dongiaosach) {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        {},
        "Don giao sach khong ton tai"
      );
    }
    return response(
      res,
      StatusCodes.OK,
      true,
      newDonGiaoSach,
      "Cap nhat don giao sach thanh cong"
    );
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      "Khong cap nhat duoc don giao sach"
    );
  }
};

const deleteDonGiaoSach = async (req, res) => {
  try {
    const id = req.param.id;
    const deleteDonGiaoSach = await DonGiaoSach.findByIdAndDelete(id);
    if (!deleteDonGiaoSach) {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        {},
        "Don giao sach khong ton tai"
      );
    }
    return responst(
      res,
      StatusCodes.OK,
      true,
      {},
      "Xoa don giao sach thanh cong"
    );
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      "Khong xoa duoc don giao sach"
    );
  }
};

const getDonGiaoSachByRefId = async (req, res) => {
  try {
    const query = {};
    if (req.query.maTDMS) query.maTDMS = req.query.maTDMS;
    if (req.query.masach) query.masach = req.query.masach;
    const dongiaosachs = await DonGiaoSach.find(query);
    return response(
      res,
      StatusCodes.OK,
      true,
      dongiaosachs,
      "Lay danh sach thanh cong"
    );
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      "Khong lay duoc don giao sach theo ma thoi diem muon sach"
    );
  }
};

module.exports = {
  createDonGiaoSach,
  getAllDonGiaoSach,
  getDonGiaoSachById,
  updateDonGiaoSach,
  deleteDonGiaoSach,
  getDonGiaoSachByRefId,
};
