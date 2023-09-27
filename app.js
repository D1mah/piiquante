const express= require('express');
const mongoose=require('mongoose');
const path = require('path');
const cors= require('cors');

const dotenv = require("dotenv");

dotenv.config();

// Imports lié à la sécurité
  // helmet is for rework request headers and hide sensible infos 
const helmet = require("helmet");
  // The express-rate-limit is for limiting the incoming request.
const rateLimit = require("express-rate-limit");
// expresse-mongo-sanitize is to prevent mongoDB injection
const mongoSanitize= require ("express-mongo-sanitize");


// Importation des routeurs dans l'application
const sauceRoutes= require('./routes/sauce');
const userRoutes= require('./routes/user');

// Creating a limiter by calling rateLimit function with options:
  // max : maximum number of request and 
  // windowMs: contains the time in millisecond so only max amount of request can be made in windowMS time.
const limiter = rateLimit({
  max: 200,
  windowMs: 60 * 60 * 1000,
  message: "Too many request from this IP"
});


const app= express();
app.use(helmet());
app.use(mongoSanitize());

// Add the limiter function to the express middleware so that every request coming from user passes through this middleware.
app.use(limiter);

// MiddleWare de gestion des requetes CORS 
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');

  next();

});

// app.use(cors());

// Liaison Database
mongoose.connect(process.env.DBURL,
{ useNewUrlParser: true,
useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());


//Enregistrement des routes
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);



module.exports=app;



