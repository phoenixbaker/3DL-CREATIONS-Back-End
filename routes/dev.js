const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Dev = require("../schemas/Dev");

router.post("/", async (req, res) => {
  if (!req.body) return res.end();

  let user = await Dev.findOne({ email: req.body.email });
  if (!user) return res.send("Could not find account under email");

  let match = await bcrypt.compare(req.body.password, user.password);
  if (!match) return res.send("Wrong Password");

  const authToken = jwt.sign({ user }, process.env.JWT_ACCESS_TOKEN_SECRET);

  res.json({
    authToken,
    user,
  });
});

router.post("/register", async (req, res) => {
  if (!req.body) return res.end();

  let user = await Dev.findOne({ email: req.body.email });
  if (user) return res.send("Account with Email Already Registered");

  user = new Dev({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    dev: true,
  });

  await user.save();

  res.send(user);
});

module.exports = router;
