const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth');
const authController = require('../controllers/auth');

router.get("/signup",  authController.getSignup);
router.post('/signup',  authController.postSignup); 
router.get("/login",  authController.getLogin);


module.exports = router;
