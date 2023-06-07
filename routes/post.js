const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth');
const postController = require('../controllers/postController');


router.get('/sellerHome', ensureAuth, postController.displaySellerHomePage)
router.get('/new', ensureAuth, postController.displayNewListingForm);
router.get('/sellerHomeAllPosts', ensureAuth, postController.displaySellerHomeAllPosts)
router.get('/garagePosts', postController.getAllPosts)


router.post('/garageSale',  ensureAuth, postController.postGarageSale)


module.exports = router;
