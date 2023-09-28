const bcrypt= require('bcrypt');
const jwt= require('jsonwebtoken');
const User= require('../models/User');
const dotenv = require("dotenv");

dotenv.config();

const emailValidator=require("email-validator");
const passwordValidator = require('password-validator');

const passwordSchema = new passwordValidator();

passwordSchema
.is().min(6)                                    // Minimum length 6
.is().max(50)                                   // Maximum length 50
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits()                                 // Must have at least 1 digit
// .has().not().symbols()                          // Has no symbols
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

exports.signup = (req, res, next) => {
    if (emailValidator.validate(req.body.email) && passwordSchema.validate(req.body.password)){
    bcrypt.hash(req.body.password, 10)
    .then(hash=>{
        const user=new User({
            email: req.body.email,
            password: hash
        });
        user.save()
        .then(()=> res.status(201).json({ message:"Utilisateur créé !"}))
        .catch(error=>res.status(400).json({error}));
    })
    .catch(error=>res.status(500).json({error}));
}else{
    res.status(401).json({message:"Format de la paire email/password incorrect !"});
}
};

exports.login = (req, res, next) => {
    User.findOne({email:req.body.email})
    .then(user=>{
        if (user===null){
            res.status(401).json({message: 'Paire identifiant/mot de passe incorrecte !'});
        }else{
            bcrypt.compare(req.body.password, user.password)
            .then( valid => {
                if (!valid){
                    res.status(401).json({message: 'Paire identifiant/mot de passe incorrecte !'});
                }else{
                    res.status(200).json({
                        userId: user._id,
                        token:jwt.sign(
                            {userId: user._id},
                            process.env.TOKEN_SECRET,
                            {expiresIn:'24h'}
                        )
                    });
                }
            })
            .catch(error=> res.status(500).json({error}));
        }
    })
    .catch(error=>{
        res.status(500).json(error);
    });
};
