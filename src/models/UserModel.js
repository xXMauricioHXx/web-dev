const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    _id: mongoose.ObjectId,
    name: String,
    mail: String,
    password: String,
    cep: String,
    favoriteProducts: [{
        /*product: {
            type: mongoose.ObjectId,
            ref: Produto
        }*/
    }]
});

module.exports = mongoose.model('userModel', UserSchema);