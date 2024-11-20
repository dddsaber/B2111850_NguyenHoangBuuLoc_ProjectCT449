const { StatusCodes } = require("http-status-codes");
const { response } = require("../../utils/response.util");
const { TheThuVien } = require("../../models/thethuvien.model");
const { sendEmail } = require("../mail.controller");
const { User } = require("../../models/User.model");

const getTheThuVienByUserId = async (req, res) => {
  const userId = req.params.id;

  try {
    if (!userId) {
      return response(res, StatusCodes.BAD_REQUEST, false, {}, "Thiếu userId");
    }
    const theThuVien = await TheThuVien.findOne({ docgia: userId });
    if (!theThuVien) {
      return response(
        res,
        StatusCodes.OK,
        false,
        {},
        "Không tìm thấy thông tin the thư viện"
      );
    }
    return response(res, StatusCodes.OK, true, theThuVien, "OK");
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

const createTheThuVien = async (req, res) => {
  const { ngaygiahan, thoigiangiahan, userId, sotien } = req.body;

  try {
    if (!ngaygiahan || !thoigiangiahan || !userId || !sotien) {
      return response(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        {},
        "Thiếu thông tin"
      );
    }

    const existingTheThuVien = await TheThuVien.findOne({ docgia: userId });

    if (existingTheThuVien) {
      const ngayHetHan = new Date(existingTheThuVien.ngayhethan);
      ngayHetHan.setMonth(ngayHetHan.getMonth() + thoigiangiahan);

      existingTheThuVien.ngaygiahan = ngaygiahan;
      existingTheThuVien.ngayhethan = ngayHetHan;
      existingTheThuVien.lichsugiahan.push({
        ngaygiahan: new Date(ngaygiahan),
        thoigiangiahan,
        sotien,
      });

      const updatedTheThuVien = await existingTheThuVien.save();

      if (!updatedTheThuVien) {
        return response(
          res,
          StatusCodes.INTERNAL_SERVER_ERROR,
          false,
          {},
          "Cập nhật the thư viện thất bại"
        );
      }
      const user = await User.findById(userId);

      await sendEmail(
        user.email,
        "Cập nhật thẻ thư viện thành công",
        `Thông tin thẻ thư viện của bạn: ${updatedTheThuVien}`
      );
      return response(
        res,
        StatusCodes.OK,
        true,
        existingTheThuVien,
        "Cập nhật thẻ thư viện thành công"
      );
    } else {
      const ngayHetHan = new Date(ngaygiahan);
      ngayHetHan.setMonth(ngayHetHan.getMonth() + thoigiangiahan);

      // Nếu chưa có, tạo mới thẻ thư viện
      const newTheThuVien = await TheThuVien.create({
        ngaygiahan,
        ngayhethan: ngayHetHan,
        trangthai: "conhieuluc",
        docgia: userId,
        lichsugiahan: [
          {
            ngaygiahan: new Date(ngaygiahan),
            thoigiangiahan,
            sotien,
          },
        ],
      });

      if (!newTheThuVien) {
        return response(
          res,
          StatusCodes.BAD_REQUEST,
          false,
          {},
          "Không tạo được thẻ thư viện"
        );
      }
      const user = await User.findById(userId);

      await sendEmail(
        user.email,
        "Tạo thẻ thư viện thành công",
        `Thông tin thẻ thư viện của bạn: ${newTheThuVien}`
      );
      return response(
        res,
        StatusCodes.CREATED,
        true,
        newTheThuVien,
        "Tao thẻ thư viện thành công"
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

const giaHanThe = async (res, req) => {
  const { userId, sotien, thoigiangiahan } = req.body;
  try {
    if (!userId || !sotien || !thoigiangiahan) {
      return response(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        {},
        "Thiếu thông tin"
      );
    }
    const newNgayGiaHan = new Date();
    const theThuVien = await TheThuVien.findOneAndUpdate(
      {
        docgia: userId,
        trangthai: "conhieuluc",
        ngaygiahan: newNgayGiaHan,
        ngayhethan: newNgayGiaHan.setMonth(
          newNgayGiaHan.getMonth + thoigiangiahan
        ),
      },
      {
        $push: {
          lichsugiahan: {
            ngaygiahan: new Date(),
            thoigiangiahan,
            sotien,
          },
        },
      },
      { new: true }
    );

    if (!theThuVien) {
      return response(
        res,
        StatusCodes.NOT_FOUND,

        false,
        {},
        "Không tìm thấy th�� thư viện"
      );
    }

    return response(
      res,
      StatusCodes.OK,
      true,
      theThuVien,
      "Gia hạn thành công"
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

const khoaThe = async (req, res) => {
  const { userId } = req.body;
  try {
    if (!userId) {
      return response(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        {},
        "Thiếu thông tin"
      );
    }

    const theThuVien = await TheThuVien.findOneAndUpdate(
      { docgia: userId, trangthai: "conhieuluc" },
      { trangthai: "bikhoa" },
      { new: true }
    );

    if (!theThuVien) {
      return response(
        res,
        StatusCodes.NOT_FOUND,

        false,
        {},
        "Không tìm thấy th�� thư viện"
      );
    }

    return response(res, StatusCodes.OK, true, theThuVien, "Khoá thành công");
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
  createTheThuVien,
  giaHanThe,
  khoaThe,
  getTheThuVienByUserId,
};
