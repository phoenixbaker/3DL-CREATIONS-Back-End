const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../schemas/User");

router.post("/", async (req, res) => {
  if (!req.body) return res.end();

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.send("Could not find account under email");

  let match = await bcrypt.compare(req.body.password, user.password);
  if (!match) return res.send("Wrong Password");

  const authToken = jwt.sign({ user }, process.env.JWT_ACCESS_TOKEN_SECRET);

  res.json({
    authToken,
    user: {
      name: user.name,
      email: user.email,
      dev: user.dev,
    },
  });
});

router.post("/register", async (req, res) => {
  if (!req.body) return res.end();

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.send("Account with Email Already Registered");

  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  await user.save();

  res.send(user);
});

module.exports = router;
