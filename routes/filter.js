const router = require("express").Router();

const updateFilter = require("../middleware/UpdateFilter");
const Filter = require("../schemas/Filter");

router.get("/", async (req, res) => {
  let [filter] = await Filter.find({});
  return res.send(filter);
});

router.get("/create", async (req, res) => {
  let [filter] = await Filter.find({});
  console.log(filter);
  if (filter) return res.send(filter);

  filter = new Filter({
    price: [50, 70],
    size: [12, 30],
    tags: ["Popular", "Soccer", "Basketball"],
  });
  await filter.save();
  return res.send(filter);
});

module.exports = router;
