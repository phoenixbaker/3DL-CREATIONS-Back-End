const express = require("express");
const app = express();
const json = require("express").json();
const static = require("express").static("public");
const dotenv = require("dotenv").config();
const helmet = require("helmet")();
const mongoose = require("mongoose");
const busboy = require("connect-busboy")();

const path = require("path");

app.use("static", express.static(__dirname + "/public"));

// !!! Remove After Deployment

const cors = require("cors");
app.use(cors());

mongoose.connect(process.env.URL);

const reviewRouter = require("./routes/review");
const sanityCheck = require("./sanityCheck");
const authRouter = require("./routes/auth");
const devRouter = require("./routes/dev");
const uploadRouter = require("./routes/upload");
const productsRouter = require("./routes/products");
const downloadRouter = require("./routes/download");
const filterRouter = require("./routes/filter");
const confirmationRouter = require("./routes/confirmation");

app.set("trust proxy", true);

app.use(helmet);
app.use(json);
app.use(static);
app.use(busboy);

app.use("/", sanityCheck);

app.use("/review", reviewRouter);
app.use("/auth", authRouter);
app.use("/products", productsRouter);
app.use("/filter", filterRouter);
app.use("/download", downloadRouter);
app.use("/confirmation", confirmationRouter);

app.use("/dev/auth", devRouter);
app.use("/dev/upload", uploadRouter);

process.once("SIGUSR2", function () {
  process.kill(process.pid, "SIGUSR2");
});

process.on("SIGINT", function () {
  // this is only called on ctrl+c, not restart
  process.kill(process.pid, "SIGINT");
});

const port = process.env.PORT;
app.listen(port, () => console.log("Listening on Port " + port));
