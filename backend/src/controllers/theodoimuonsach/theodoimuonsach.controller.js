const { StatusCodes } = require("http-status-codes");
const { response } = require("../../utils/response.util");
const { TheoDoiMuonSach } = require("../../models/theodoimuonsach.model");
const BanSaoSach = require("../../models/bansaosach.model");
const { TRANGTHAI_MUONSACH, LOAIMUON } = require("../../utils/constants.util");
const { updateStatusBanSach } = require("../bansaosach/bansaosach.controller");
const { User } = require("../../models/User.model");
const { TheThuVien } = require("../../models/thethuvien.model");
const createTheoDoiMuonSach = async (req, res) => {
  try {
    const theodoimuonsach = req.body;
    if (!theodoimuonsach) {
      return response(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        {},
        "No data provided"
      );
    }
    if (
      theodoimuonsach.mathethuvien === undefined ||
      theodoimuonsach.mathuthu === undefined ||
      theodoimuonsach.sachmuon === undefined ||
      theodoimuonsach.loaimuon === undefined
    ) {
      return response(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        {},
        "Missing required fields: mabansao, mathethuvien, mathuthu, sachmuon"
      );
    }

    if (theodoimuonsach.loaimuon === LOAIMUON.tructiep) {
      theodoimuonsach.trangthai = TRANGTHAI_MUONSACH.dangmuon;
    } else if (theodoimuonsach.loaimuon === LOAIMUON.tructuyen) {
      theodoimuonsach.trangthai = TRANGTHAI_MUONSACH.dangchoxuly;
    } else {
      return response(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        {},
        "Invalid loaimuon"
      );
    }

    for (const mabansao of theodoimuonsach.sachmuon) {
      updateStatusBanSach(mabansao, false);
    }

    const newTheoDoiMuonSach = await TheoDoiMuonSach.create(theodoimuonsach);
    return response(
      res,
      StatusCodes.CREATED,
      true,
      { theodoimuonsach: newTheoDoiMuonSach },
      "Muon sach thanh cong"
    );
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      "Create theo doi muon sach failed: " + error.message
    );
  }
};

const createTheoDoiMuonSachOnline = async (req, res) => {
  const tdmsRecord = req.body;
  try {
    if (!tdmsRecord) {
      return response(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        {},
        "No data provided"
      );
    }
    const data = [];
    for (const sachId of tdmsRecord.masach) {
      // Dùng of thay vì in cho array
      const bansaosach = await BanSaoSach.findOne({
        masach: sachId,
        sanco: true,
      }); // Thêm await để xử lý async
      if (bansaosach) {
        data.push(bansaosach._id);
        updateStatusBanSach(bansaosach._id, false);
      }
    }

    if (data.length === 0) {
      return response(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        {},
        "Không có bản sao sách nào được mượn"
      );
    }

    const ngaymuon = new Date();
    const ngaytradukien = new Date(ngaymuon);
    ngaytradukien.setDate(ngaymuon.getDate() + 14); // Thêm 14 ngày để tính 2 tuần

    const newtdmsRecord = await TheoDoiMuonSach.create({
      sachmuon: data,
      mathethuvien: tdmsRecord.mathethuvien,
      loaimuon: tdmsRecord.loaimuon,
      trangthai: tdmsRecord.trangthai,
      ngaymuon: ngaymuon,
      ngaytradukien: ngaytradukien,
    });

    return response(
      res,
      StatusCodes.CREATED,
      true,
      newtdmsRecord,
      "Tạo theo dõi mượn sách thành công"
    );
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      `Create theo doi muon sach failed: ${error.message}`
    );
  }
};

const getAllTheoDoiMuonSach = async (req, res) => {
  try {
    const {
      ngaymuon,
      ngaytra,
      trangthai,
      loaimuon,
      limit,
      sortBy,
      docgia,
      ngayketthuc,
    } = req.body;

    const filter = {};
    if (ngaymuon) {
      filter.ngaymuon = ngayketthuc
        ? { $gte: new Date(ngaymuon), $lte: new Date(ngayketthuc) }
        : { $gte: new Date(ngaymuon) };
    }

    if (ngaytra) {
      filter.ngaytra = ngayketthuc
        ? { $gte: new Date(ngaytra), $lte: new Date(ngayketthuc) }
        : { $gte: new Date(ngaytra) };
    }

    if (trangthai) filter.trangthai = trangthai;
    if (loaimuon) filter.loaimuon = loaimuon;

    let thethuvienIds = [];
    if (docgia) {
      try {
        const users = await User.find({
          name: { $regex: docgia, $options: "i" },
        });

        if (users.length > 0) {
          const thethuviens = await TheThuVien.find({
            docgia: { $in: users.map((user) => user._id) },
          });

          if (thethuviens.length > 0) {
            thethuvienIds = thethuviens.map((t) => t._id);
          }

          if (thethuvienIds.length > 0) {
            filter.mathethuvien = { $in: thethuvienIds };
          }
        } else {
          filter.mathethuvien = { $in: [] };
        }
      } catch (error) {
        return response(
          res,
          StatusCodes.INTERNAL_SERVER_ERROR,
          false,
          {},
          "Get user by name failed: " + error.message
        );
      }
    }

    const aggregationPipeline = [
      { $match: filter },

      {
        $lookup: {
          from: "thethuviens",
          localField: "mathethuvien",
          foreignField: "_id",
          as: "thethuvien_data",
        },
      },
      { $unwind: "$thethuvien_data" },

      {
        $lookup: {
          from: "users",
          localField: "thethuvien_data.docgia",
          foreignField: "_id",
          as: "user_data",
        },
      },
      { $unwind: "$user_data" },

      {
        $project: {
          _id: 1,
          mathethuvien: 1,
          mathuthu: 1,
          ngaymuon: 1,
          ngaytradukien: 1,
          ngaytra: 1,
          trangthai: 1,
          loaimuon: 1,
          sachmuon: 1,
          sachtra: 1,
          "user_data.name": 1,
          "user_data.email": 1,
        },
      },

      sortBy
        ? { $sort: { [sortBy.field]: sortBy.order === "asc" ? 1 : -1 } }
        : { $sort: { createAt: -1 } },

      limit ? { $limit: limit } : null,
    ].filter(Boolean);

    const theodoimuonsachs = await TheoDoiMuonSach.aggregate(
      aggregationPipeline
    );

    const total = await TheoDoiMuonSach.countDocuments(filter);

    return response(
      res,
      StatusCodes.OK,
      true,
      { theodoimuonsachs, total },
      "Get all theo doi muon sach successfully"
    );
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      "Get all theo doi muon sach failed: " + error.message
    );
  }
};

const getTheoDoiMuonSachById = async (req, res) => {
  try {
    const id = req.params.id;
    const theodoimuonsach = await TheoDoiMuonSach.findById(id);
    if (!theodoimuonsach) {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        {},
        "Theo doi muon sach not found"
      );
    }
    return response(
      res,
      StatusCodes.OK,
      true,
      { theodoimuonsach: theodoimuonsach },
      "Thanh cong"
    );
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      "Get theo doi muon sach by id failed: " + error.message
    );
  }
};

const deleteTheoDoiMuonSach = async (req, res) => {
  try {
    const id = req.params.id;
    const theodoimuonsach = await TheoDoiMuonSach.findByIdAndDelete(id);
    if (!theodoimuonsach) {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        {},
        "Theo doi muon sach not found"
      );
    }
    return response(res, StatusCodes.NO_CONTENT, true, {}, "Xoa thanh cong");
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      "Delete theo doi muon sach failed: " + error.message
    );
  }
};

const getTheoDoiMuonSachByRefId = async (req, res) => {
  try {
    const query = {};
    if (req.query.masach) query.masach = req.query.masach;
    if (req.query.mabansao) query.mabansao = req.query.mabansao;
    if (req.query.mathethuvien) query.mathethuvien = req.query.mathethuvien;
    const theodoimuonsachs = await TheoDoiMuonSach.find(query);
    return response(
      res,
      StatusCodes.OK,
      true,
      { theodoimuonsachs: theodoimuonsachs },
      "Get all theo doi muon sach by refId successfully"
    );
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      "Get all theo doi muon sach by refId failed: " + error.message
    );
  }
};

const updateTheoDoiMuonSach = async (req, res) => {
  try {
    const id = req.params.id;
    const theodoimuonsach = await TheoDoiMuonSach.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    if (!theodoimuonsach) {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        {},
        "Theo doi muon sach not found"
      );
    }

    for (mabansao in theodoimuonsach.sachmuon) {
      updateStatusBanSach(mabansao, true);
    }
    return response(
      res,
      StatusCodes.OK,
      true,
      { theodoimuonsach: theodoimuonsach },
      "Update theo doi muon sach thanh cong"
    );
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      "Update theo doi muon sach failed: " + error.message
    );
  }
};

const updateTrangThaiTDMS = async (req, res) => {
  const id = req.params.id;

  const tdms = req.body;
  try {
    // Kiểm tra xem tất cả sách trong sachmuon đã có trong sachtra chưa
    const allBooksReturned = tdms.sachmuon.every(
      (sachId) => tdms.sachtra && tdms.sachtra.includes(sachId) // Kiểm tra sachtra có tồn tại và chứa tất cả sách trong sachmuon
    );

    // Nếu tất cả sách trong sachmuon đều có trong sachtra, thì set status = true
    const status = allBooksReturned ? "datra" : tdms.trangthai;
    tdms.trangthai = status;
    const theodoimuonsach = await TheoDoiMuonSach.findByIdAndUpdate(
      id,
      { ...tdms },
      { new: true }
    );
    console.log(theodoimuonsach);
    for (const mabansao of tdms.sachtra) {
      updateStatusBanSach(mabansao, true);
    }
    if (!theodoimuonsach) {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        {},
        "Theo doi muon sach not found"
      );
    }

    return response(
      res,
      StatusCodes.OK,
      true,
      { theodoimuonsach: theodoimuonsach },
      "Update trang thai thanh cong"
    );
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      "Update trang thai theo doi muon sach failed: " + error.message
    );
  }
};
const getTheoDoiMuonSachByUserId = async (req, res) => {
  try {
    const { userId } = req.params; // Nhận user._id từ params

    // Tìm các thẻ thư viện thuộc user
    const theThuViens = await TheThuVien.find({ docgia: userId });

    if (!theThuViens || theThuViens.length === 0) {
      return response(
        res,
        StatusCodes.NOT_FOUND,
        false,
        {},
        "No TheoDoiMuonSach found for the given user."
      );
    }

    // Lấy danh sách ID của thẻ thư viện
    const theThuVienIds = theThuViens.map((the) => the._id);

    // Tìm tất cả TheoDoiMuonSach liên quan đến các thẻ thư viện này
    const theodoimuonsachs = await TheoDoiMuonSach.find({
      mathethuvien: { $in: theThuVienIds },
    });

    return response(
      res,
      StatusCodes.OK,
      true,
      { theodoimuonsachs },
      "Get TheoDoiMuonSach by user ID successfully"
    );
  } catch (error) {
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      "Failed to get TheoDoiMuonSach by user ID: " + error.message
    );
  }
};

module.exports = {
  createTheoDoiMuonSach,
  getAllTheoDoiMuonSach,
  getTheoDoiMuonSachById,
  deleteTheoDoiMuonSach,
  getTheoDoiMuonSachByRefId,
  updateTheoDoiMuonSach,
  updateTrangThaiTDMS,
  getTheoDoiMuonSachByUserId,
  createTheoDoiMuonSachOnline,
};
