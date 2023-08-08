const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const multer = require('multer');
const checkAuth = require('../middleware/auth');
const storage = multer.diskStorage({
    destination: function (req, file, cb){
     cb(null, './Videos/');
    },
    filename: function(req,file,cb){
     cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) =>{
    if(file.mimetype === 'video/mp4' || file.mimetype === 'video/mp3'){
    cb(null, true);
    }else {
        cb('Video must be mp3 or mp4', false);
    }
    };

const upload = multer({storage: storage, fileFilter:fileFilter});




router.post('/save',  userController.saveUser);
router.post('/login', userController.loginUser);
router.put('/upload/:id',checkAuth, upload.array('video'), userController.uploadVideo);

router.get('/:id',checkAuth, userController.showVideo);
//router.get('/:id', userController.showVideo);


module.exports = router;