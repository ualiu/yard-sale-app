const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth');
const authController = require('../controllers/auth');

router.get("/signup",  ensureGuest, authController.getSignup);
router.post('/signup',  authController.postSignup); 
router.get("/login",  ensureGuest, authController.getLogin);
router.post("/login", ensureGuest, authController.postLogin);
router.get("/logout", authController.logout);


module.exports = router;
