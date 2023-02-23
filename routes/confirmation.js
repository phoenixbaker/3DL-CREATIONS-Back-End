const router = require("express").Router();
const jwt = require("jsonwebtoken");

const User = require("../schemas/User");

router.get("/:id", async (req, res) => {
  let id = req.params.id;
  if (!id) return res.send("Enable Redirect");

  jwt.verify(
    id,
    process.env.JWT_EMAIL_VERIFICATION_SECRET,
    async (err, jwt) => {
      if (err || !jwt) return res.send(err);

      let user = await User.findById(jwt.user);
      if (user.confirmed) return res.send("Email Already Confirmed");

      user.confirmed = true;
      await user.save();

      res.send(user);
    }
  );
});

module.exports = router;
