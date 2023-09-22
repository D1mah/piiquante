const express= require('express');
const mongoose=require('mongoose');
const path = require('path');

// Importation des routeurs dans l'application
const userRoutes= require('./routes/user');


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

//Enregistrement des routes
app.use('/api/auth', userRoutes);

app.use('/images', express.static(path.join(__dirname, 'images')));


module.exports=app;



