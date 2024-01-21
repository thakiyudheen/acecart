const mongoose = require('mongoose');

// Declare the Schema of the Mongo model
var bannerSchema = new mongoose.Schema({
  bannerName: {
    type: String,
  },
  description: {
    type: String,
  },
  bannerImage: {
    type: String,
  },
});

// Export the model
module.exports = mongoose.model('banner', bannerSchema);
