// -------------------Import------------------
const mongoose= require('mongoose');

const sauceSchema= mongoose.Schema({
    //    l'identifiant MongoDB unique de l'utilisateur qui a créé la sauce
    userId:{type: String, required:true },
    // nom de la sauce
    name:{type:String, required:true},
    // fabricant la sauce
    manufacturer:{type:String, required:true},
    // description de la sauce
    description: {type:String, required:true},
    // principal ingrédient épicé de la sauce
    mainPepper: {type:String, required:true},
    // URL de l'image de la sauce téléchargée par l'utilisateur
    imageUrl: {type:String, required:true},
    // nombre entre 1 et 10 décrivant la piquance de la sauce
    heat: {type: Number, required:true},
    // nombre d'utilisateurs qui aiment (= likent) la sauce
    likes: {type: Number, required:true},
    // nombre d'utilisateurs qui n'aiment pas la sauce
    dislikes: {type: Number, required:true},
    // tableau des identifiants des utilisateurs qui ont aimé la sauce
    usersLiked: {type : Array, required:true},
    // tableau des identifiants des utilisateurs qui n'ont pas aimé (= disliked) la sauce
    usersDisliked: {type: Array, required:true},
});

// ----------------- Export------------------

module.exports= mongoose.model('Sauce', sauceSchema);

