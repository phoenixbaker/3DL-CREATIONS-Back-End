const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("yes!");
});

module.exports = router;
