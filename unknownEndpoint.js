const unknownEndpoint = (req, res, next) => {
  res.status(404);
  res.json({ status: 404, message: "Route not found" });
  next();
};

module.exports = {
  unknownEndpoint,
};