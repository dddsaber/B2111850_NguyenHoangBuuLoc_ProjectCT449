const config = require("./src/config/connect");
const express = require("express");
const cors = require("cors");
const path = require("path");
const { connect } = require("mongoose");

const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  cors({
    origin: "*",
  })
);

//Add Routes
const nguoidungRoute = require("./src/routes/user.routes");
const authRoute = require("./src/routes/auth.routes");
const sachRoute = require("./src/routes/sach.routes");
const nhaxuatbanRoute = require("./src/routes/nhaxuatban.routes");
const bansaosachRoute = require("./src/routes/bansaosach.routes");
const theodoimuonsachRoute = require("./src/routes/theodoimuonsach.routes");
const dongiaosachRoute = require("./src/routes/dongiaosach.routes");
const theThuVienRoute = require("./src/routes/thethuvien.routes");
const fileRouter = require("./src/routes/file.routes");
const sachyeuthichRoute = require("./src/routes/sachyeuthich.routes");
const mailRoute = require("./src/routes/mail.routes");

app.use("/user", nguoidungRoute);
app.use("/auth", authRoute);
app.use("/sach", sachRoute);
app.use("/nhaxuatban", nhaxuatbanRoute);
app.use("/bansaosach", bansaosachRoute);
app.use("/theodoimuonsach", theodoimuonsachRoute);
app.use("/dongiaosach", dongiaosachRoute);
app.use("/thethuvien", theThuVienRoute);
app.use("/sachyeuthich", sachyeuthichRoute);
app.use("/mail", mailRoute);
// const { createServer } = require("http");

// const httpServer = createServer(app);
app.use("/upload", fileRouter);

// Serve static images
app.use("/upload", express.static("upload"));
async function startServer() {
  try {
    connect(config.db.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
      .then(() => {
        console.log("Database Connected");
      })
      .catch((e) => {
        console.log("Database Connection Error");
      });

    app.listen(config.app.port, () => {
      console.log(`Server is running on port ${config.app.port}`);
    });
  } catch (error) {
    console.log("Cannot connect to the database!", error);
    process.exit();
  }
}

startServer();
