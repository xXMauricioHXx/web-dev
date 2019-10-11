const userModel = require('../models/UserModel');

class UserController{

    async listFavorites(req, res, next){

        const { user_id } = req.headers;

        const favorites = await userModel.favorites;

        if(!favorites){
            
            return res.status(404).json({error: 'Favorite product not found'});
            //throw new Error('Product not found');
        
        }

        return res.json(favorites);
    }

}

module.exports = UserController;