const router = require("express").Router();

const Review = require("../schemas/Review");
const Product = require("../schemas/Product");
const User = require("../schemas/User");

const authenticateToken = require("../middleware/AuthenticateToken");

router.post("/:id", authenticateToken, async (req, res) => {
  let id = req.user._id;
  let prod_id = req.params.id;

  let user = await User.findById(req.user._id);

  let review = new Review({
    by: id,
    rating: req.body.rating,
    text: req.body.text,
  });

  review = await review.save();
  let prod = await Product.findById(prod_id);
  if (!prod) return res.send("Product ID Wrong");

  if (!prod.ratings.posted) prod.ratings.posted = [review._id];
  else prod.ratings.posted.push(review._id);

  await prod.save();

  if (!user.reviews) user.reviews = [review._id];
  else user.reviews.push(review._id);
  await user.save();

  res.end();
});

router.delete("/:prodId/:id", authenticateToken, async (req, res) => {
  let review_id = req.params.id;
  let prod_id = req.params.prodId;

  let user = await User.findById(req.user._id);
  let review = await Review.findById(review_id);

  if (review.by.toString() !== user._id.toString())
    return res.send("You did not post this review");

  let prod = await Product.findById(prod_id);
  if (!prod) return res.send("Product ID Wrong");

  await Review.findByIdAndDelete(review_id);

  prod.ratings.posted = prod.ratings.posted.filter(
    (e) => e.toString() !== review_id
  );
  await prod.save();

  user.reviews = user.reviews.filter((e) => e.toString() !== review_id);
  await user.save();

  res.end();
});

router.post("/edit/:id", authenticateToken, async (req, res) => {
  let review_id = req.params.id;
  let updatedReview = req.body;
  if (!req.body) return res.send("No body");

  let review = await Review.findById(review_id);
  if (!review) return res.send("Review ID Wrong");
  if (review.by !== req.user._id)
    return res.send("You did not post this review");

  if (updatedReview.rating) review.rating = updatedReview.rating;
  if (updatedReview.text) review.text = updatedReview.text;

  review.lastEdited = Date.now();
  await review.save();

  res.end();
});

module.exports = router;
