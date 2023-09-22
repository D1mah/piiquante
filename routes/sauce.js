
// -----------------Imports-------------------

const express= require('express');
const auth= require('../middleware/auth');
const router= express.Router();
const multer= require('../middleware/multer-config');
const sauceCtrl= require('../controllers/sauce');

//  Logique routing: Définition des différentes routes
router.get('/', auth, sauceCtrl.getAllSauce);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.modifyLike);

// -----------------Export-------------------
module.exports= router;

