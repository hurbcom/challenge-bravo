const mongoose = require('mongoose');

mongoose.connect(
  process.env.MONGO_ATLAS,
  { useNewUrlParser: true, useUnifiedTopology: true }
)

module.exports = mongoose;