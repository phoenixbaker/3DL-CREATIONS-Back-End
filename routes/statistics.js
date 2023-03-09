const router = require("express").Router();

const Product = require("../schemas/Product");

router.get("/:id", async (req, res) => {
  res.end();
});

module.exports = router;
