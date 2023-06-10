const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth');
const postController = require('../controllers/postController');
// const multer = require('multer');
// const upload = require('../config/upload');
// const Post = require('../models/postModel')

router.get('/sellerHome', ensureAuth, postController.displaySellerHomePage)
router.get('/new', ensureAuth, postController.displayNewListingForm);
router.get('/sellerHomeAllPosts', ensureAuth, postController.displaySellerHomeAllPosts)
router.get('/garagePosts', postController.getAllPosts)
router.get('/getEdit/:id', ensureAuth, postController.displayEditForm)

// router.post('/garageSale', upload.array('images', 5), postController.postGarageSale);
// router.get('/upload', postController.renderImages);


router.post('/garageSale',  ensureAuth, postController.postGarageSale)
router.put('/:id', ensureAuth, postController.updatePost)
router.delete('/:id', ensureAuth, postController.deletePost)


module.exports = router;

