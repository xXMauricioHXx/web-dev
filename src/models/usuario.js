const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  _id: mongoose.ObjectId,
  name: String,
  email: String,
  password: String,
  cep: String,
  favoriteProducts: Array,
});

module.exports = mongoose.model('user', UserSchema);
