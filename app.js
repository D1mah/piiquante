const express= require('express');
const mongoose=require('mongoose');



const app= express();


// MiddleWare de gestion des requetes CORS 
app.use((req, res, next)=>{
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
})

// Liaison Database
mongoose.connect('mongodb+srv://bhamid:GFq8hGPkZqgGSzpU@cluster0.vygiroe.mongodb.net/?retryWrites=true&w=majority',
{ useNewUrlParser: true,
useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

app.use((req,res,next)=>{
    console.log("Requête reçue !");
    next();
})

app.use((req, res,next)=>{
    res.status(201);
    next();
})

app.use((req,res, next)=>{
    res.json({message:'Votre requête a bien été reçue à nouveau !'})
    next();
});

app.use((req, res,next)=>{
    console.log('La réponse a été envoyé avec succès!')
    next();
})

app.use((req, res,next)=>{
  console.log("T'es un champion mais active toi!")
})

module.exports=app;



