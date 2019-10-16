const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  cep: String,
  favoriteProducts: Array,
});

module.exports = mongoose.model('user', UserSchema);
