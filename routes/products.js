const router = require("express").Router();
const mongoose = require("mongoose");

const Product = require("../schemas/Product");

let conn = mongoose.connection;

router.get("/all", async (req, res) => {
  let products = await Product.find({});
  return res.send(products);
});

router.get("/:id", async (req, res) => {
  let product = await Product.findById(req.params.id);
  return res.send(product);
});

router.post("/version", async (req, res) => {
  let products = await Product.find({});
  let clientVersion = req.body.keys;

  let tempObj = {};
  let tempArr = [];

  clientVersion.forEach((ver) => {
    tempObj[ver._id] = ver.__v;
  });

  for (var i = 0; i < products.length; i++) {
    if (tempObj[products[i]._id.toString()] !== products[i].__v) {
      tempArr.push(products[i]._id);
    }
    delete tempObj[products[i]._id.toString()];
  }
  console.log([tempArr, Object.keys(tempObj)]);
  return res.send([tempArr, Object.keys(tempObj)]);
});

conn.once("open", () => {
  let gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "ProductPhotos",
  });

  router.delete("/dev/:id", async (req, res) => {
    let product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.send("No Product Found");
    for (var i = 0; i < product.photos_id.length; i++) {
      let objectId = new mongoose.Types.ObjectId(product.photos_id[i]);
      gridfsBucket.delete(objectId);
    }

    return res.send("Deleted");
  });
});

module.exports = router;
