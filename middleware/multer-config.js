const multer= require('multer');
// const uuid=require('uuid').v4;
const path= require ('path');

const MIME_TYPES={
    'image/jpg':'jpg',
    'image/jpeg':'jpg',
    'image/png':'png'
}

const storage= multer.diskStorage({
    destination:path.join(__dirname, '../images'),
    filename: (req, file, callback)=>{
        const name=file.originalname.split('.')[0];
        const newName= name.split(' ').join('_');
        const extension= MIME_TYPES[file.mimetype];
        callback(null, newName +'-'+ Date.now() + '.' + extension);

    }
});

module.exports=multer({storage:storage}).single('image');