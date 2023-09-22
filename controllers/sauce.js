
// -----------------Imports-------------------

const Sauce= require('../models/Sauce');
const fs= require('fs');


// Logique métier: Définition des différentes actions API

exports.getAllSauce=(req, res, next) => {
    Sauce.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({error}));
};

exports.createSauce=(req, res, next)=>{
    const sauceObject= JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce= new Sauce({
      ...sauceObject,
      userId:req.auth.userId,
      imageUrl:` ${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    //   initialisation des compteurs likes/dislikes et tableaux users associés
      likes:0,
      dislikes:0,
      usersLiked:[],
      usersDisliked:[]
    })  ;
    sauce.save()
    .then(()=>{res.status(201).json({message:'Sauce enregistrée !'})})
    .catch(error =>{res.status(400).json({error})});
};

exports.getOneSauce= (req, res, next)=>{
    Sauce.findOne({_id: req.params.id})
        .then(sauce=> res.status(200).json(sauce))
        .catch(error=>res.status(404).json({error}));
};



exports.modifySauce= (req, res, next)=>{
    // on regarde si il y a un objet file dans la requête
    const sauceObject=req.file ?{
        // Si il y a, on récupère l'objet en parsant la chaîne de caractère et en recréant l'url de l'image comme fait précédemment.
      ...JSON.parse(req.body.sauce),
      imageUrl:` ${req.protocol}://${req.get('host')}/images/${req.file.filename}`}
        //   Si il n'y a pas d'objet de transmis on directement l'objet dans le corps de la requete.
    : {...req.body};
    // On supprime l'id de la requête pour éviter que quelqu'un crée un objet à son nom puis le modifie pour le réassigner à quelqu'un d'autre.
    delete sauceObject._userId;
    // On cherche l'objet dans la db pour le récupérer. pour vérifier si c'est bien l'utilisateur à qui appartient l'objet qui cherche à le modifier.
    Sauce.findOne({_id: req.params.id})
    .then((sauce)=>{
      if (sauce.userId != req.auth.userId){
        res.status(401).json({message : 'Non-autorisé !'})
      }else {
        // On met à jour l'enregistrement
        Sauce.updateOne({_id:req.params.id}, {...sauceObject, _id: req.params.id})
        .then(()=> res.status(200).json({message: 'Sauce modifiée !'}))
        .catch(error => res.status(401).json({error}));
      }
    })
    .catch((error)=> {res.status(400).json({error});
  });
};

// updateOne(filtre, objet de mise à jour): update prend deux arguments: un filtre (quel enregistrement à mettre à jour) et l'objet (ici il contient: ce qu'on a récupérer dans le corps de notre fonction et l'id qui vient des paramètres de l'URL)

exports.deleteSauce= (req, res, next)=>{
    Sauce.findOne({_id:req.params.id})
      .then(sauce=> {
        if (sauce.userId != req.auth.userId){
          res.status(401).json({message: 'Non autorisé !'});
        }
        else{
          const filename=sauce.imageUrl.split('/images/')[1];
          fs.unlink(`images/${filename}`,()=> {
            Sauce.deleteOne({_id:req.params.id})
              .then(()=>{res.status(200).json({message: 'Sauce supprimée !'})})
              .catch (error=> res.status(401).json({error}));
          });
        }
      })
      .catch(error=> {
        res.status(500).json({error});
      });
};




exports.modifyLike= (req, res, next)=>{
    
    const userId= req.body.userId;
    const choice=req.body.like;
    
    Sauce.findOne({_id:req.params.id})
        .then(sauce=> {
            // Cherche si l'user a déjà voté, en checkant les tableaux like et dislike et attribue la valeur du précédent vote à voted.
            const voted= sauce.usersLiked.includes(userId)?'liked':sauce.usersDisliked.includes(userId)?'disliked':false;

            // Initialisation d'une variable nouveau vote pour ensuite mettre à jour les différents paramètres liés au like
            let newVote={};

            // Configuration des différentes valeurs de newVote selon les différents cas de figures possibles liés au nouveau choix utilisateur.
            switch(choice){
                // Cas choice=1 'like'. On prépare la variable de mise à jour dans les conditions où l'utilisateur selectionne like comme tout premier choix (voted=false).
                case (1):
                    if (!voted){
                        newVote={
                            '$addToSet':{'usersLiked':userId},
                            '$inc':{'likes':1}
                        };
                    };
                    break;
                
                // Cas choice=-1 'dislike'. On prépare la variable de mise à jour dans les conditions où l'utilisateur selectionne dislike comme tout premier choix (voted=false).    
                case(-1):
                    if (!voted){
                        newVote={
                            '$addToSet':{'usersDisliked':userId},
                            '$inc':{'dislikes':1}
                        };
                    };
                break;
       
                // Cas choice=0. On prépare la variable de mise à jour dans les conditions où l'utilisateur demande à annuler un vote déjà existant (voted=liked ou disliked).
                case (0):
                    if (voted==='liked'){
                        newVote={
                        '$pull': {'usersLiked':userId},
                        '$inc':{'likes':-1}
                        }
                    }else if (voted==='disliked'){
                        newVote={
                        '$pull': {'usersDisliked':userId},
                        '$inc':{'dislikes':-1}
                        }
                    };
                    break;
                
            };        
            // update du paramètre like selon les différentes valeur du nouveau vote (newVote)
            
            Sauce.updateOne({_id:req.params.id},newVote)
                .then(()=> res.status(200).json({message:'Le choix a été modifié !'}))
                .catch(error=> res.status(400).json({error}));
            

        })
        .catch(error=>res.status(400).json({error}));
};

