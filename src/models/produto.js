const produtos = [
  {
    _id: "1",
    name: "Batom",
    price: "R$ 125,00"
  },
  {
    _id: "2",
    name: "Batom",
    price: "R$ 125,00"
  },
  {
    _id: "3",
    name: "Batom",
    price: "R$ 125,00"
  }
];

class ProdutoModel {
  find() {
    return Promise.resolve(produtos);
  }

  findById(id) {
    return Promise.resolve(produtos.find((produto) => produto._id === id));
  }
}

module.exports = ProdutoModel;
