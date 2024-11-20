const { StatusCodes } = require("http-status-codes");
const {
  BOOK_SHOP_EMAIL,
  BOOK_SHOP_PASSWORD,
} = require("../utils/constants.util");
const nodemailer = require("nodemailer");
const { response } = require("../utils/response.util");
const sendEmail = async (email, subject, text) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: BOOK_SHOP_EMAIL,
      pass: BOOK_SHOP_PASSWORD,
    },
  });

  // Cấu hình email
  let mailOptions = {
    from: BOOK_SHOP_EMAIL, // Email người gửi
    to: email, // Email người nhận
    subject: subject, // Tiêu đề của email
    text: text,
  };

  await transporter.sendMail(mailOptions);
};

const sendOverdateEmail = async (req, res) => {
  const { email, subject, text } = req.body;
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: BOOK_SHOP_EMAIL,
        pass: BOOK_SHOP_PASSWORD,
      },
    });

    // Cấu hình email
    let mailOptions = {
      from: BOOK_SHOP_EMAIL, // Email người gửi
      to: email, // Email người nhận
      subject: subject, // Tiêu đề của email
      text: text,
    };

    await transporter.sendMail(mailOptions);
    return response(res, StatusCodes.OK, true, {}, "Email đã gửi thành công");
  } catch (error) {
    console.error(error);
    return response(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      false,
      {},
      "Loi gửi email"
    );
  }
};

module.exports = { sendEmail, sendOverdateEmail };
