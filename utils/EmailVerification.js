const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const path = require("path");
const hbs = require("nodemailer-express-handlebars");

const transporter = nodemailer.createTransport({
  service: "Gmail",
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
  console.log("here");
  jwt.sign(
    {
      user: user._id,
    },
    process.env.JWT_EMAIL_VERIFICATION_SECRET,
    {
      expiresIn: "1d",
    },
    (err, emailToken) => {
      const url = `https://api.3dlcreations.com/confirmation/${emailToken}`;

      transporter
        .sendMail({
          to: user.email,
          from: '"3DL Creations" <noreply@3dlcreations.com>',
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
