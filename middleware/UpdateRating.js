const Product = require("../schemas/Product");

async function updateRating(req, res, next) {
  let prod = await Product.findById(req.params.prodId).populate({
    path: "ratings",
    populate: { path: "posted", model: "Review" },
  });
  if (!Object.keys(prod).length) return res.send("Product ID Wrong");

  let avg = 0;

  if (prod.ratings.posted.length) {
    let sum = 0;
    prod.ratings.posted.forEach((post) => {
      sum += post.rating;
    });
    avg = sum / prod.ratings.posted.length;
  }

  console.log(avg);
  //   return res.end();
  prod.ratings.avg = avg;
  await prod.save();
  req.prod = prod;
  res.end();
}

module.exports = updateRating;
