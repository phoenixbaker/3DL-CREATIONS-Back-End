function updateStatistics(req, res, next) {
  console.log(req.ip);
  next();
}

module.exports = updateStatistics;
