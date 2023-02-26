const fs = require("fs");
const jwt = require("jsonwebtoken");
const path = require("path");
const hbs = require("nodemailer-express-handlebars");

const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

transporter.use(
  "compile",
  hbs({
    viewEngine: {
      extName: ".html",
      partialsDir: path.resolve("./views"),
      defaultLayout: false,
    },
    viewPath: path.resolve("./views"),
    extName: ".handlebars",
  })
);

async function SendVerification(user) {
  jwt.sign(
    {
      _id: user._id,
    },
    process.env.JWT_EMAIL_VERIFICATION_SECRET,
    {},
    (err, emailToken) => {
      const url = `https://api.3dlcreations.com/confirmation/${emailToken}`;

      transporter
        .sendMail({
          to: user.email,
          from: '"3DL Creations" <no-reply@3dlcreations.com>',
          subject: "Confirm Email - 3DL Creations",
          template: "Verification",
          context: {
            url: url,
          },
        })
        .catch((e) => console.warn(e));
    }
  );
}

module.exports = SendVerification;
