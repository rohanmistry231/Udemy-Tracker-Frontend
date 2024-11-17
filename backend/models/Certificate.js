const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  courseName: {
    type: String,
    required: true,
  },
});

const Certificate = mongoose.model("Certificate", certificateSchema);

module.exports = Certificate;
