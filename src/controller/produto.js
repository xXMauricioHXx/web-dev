const produtos = [
    {
        id: 1, 
        name: 'Batom',
        price: 'R$ 10,00'
    }
];
const produtoModel = new ProdutoModel();
class ProdutoController {
    list(req, res, next) {
        
        res.json(produtos);
        return next();
    }
}

module.exports = ProdutoController;