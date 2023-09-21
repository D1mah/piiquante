const jwt= require('jsonwebtoken');

module.exports=(req, res, next)=>{
    try{
        const token= req.headers.authorization.split(' ')[1];
        const decodedToken= jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId= decodedToken.userId;
        // on rajoute la valeur userId à l'objet req qui sera transmis aux routes qui seront appelées par la suite
        req.auth={
            userId:userId
        };
        next();
    }catch(error){
        res.status(401).json({error});
    }
};

// A Tester avec Postman, sans entête Authorization, pour voir si l'API refuse bien l'accès et envoie une réponse 401