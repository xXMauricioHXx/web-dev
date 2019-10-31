const mongoose = require('mongoose');

const ProdutoSchema = new mongoose.Schema({
  name: String,
  companies: [
    {
      itemId: String,
      price: String,
      oldPrice: String,
      description: String,
      installments: String,
      installmentsPrice: String,
      brand: String,
      image: String,
      siteImage: String,
      siteLink: String,
      shippingPrice: String,
      priceWithShipping: String,
    },
  ],
});

module.exports = mongoose.model('product', ProdutoSchema);
