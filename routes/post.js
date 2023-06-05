const express = require('express');
const router = express.Router();

const postController = require('../controllers/postController');


router.get('/sellerHome', postController.displaySellerHomePage)
router.get('/new', postController.displayNewCustomerForm);
router.get('/garagePosts', postController.getAllPosts)


router.post('/garageSale', postController.postGarageSale)


module.exports = router;