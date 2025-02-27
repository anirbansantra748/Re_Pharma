// routes/userRoutes.js
const express = require('express');
const passport = require('passport');
const userController = require('../controllers/userController');
const { isLoggedIn } = require('../middleware/isLoggedIn');
const router = express.Router();

router.get('/register', userController.renderRegister);
router.post('/register', userController.registerUser);
router.get('/login', userController.renderLogin);
router.post('/login', passport.authenticate('local', {
    failureRedirect: '/users/login',
    successRedirect: '/home',
}));
router.get('/logout', isLoggedIn, userController.logoutUser);
router.get('/profile', isLoggedIn, userController.renderProfile);
router.get('/chat/:id', userController.renderChat);

// New Route for Disease Prediction Page
router.get('/predictDesies', isLoggedIn, userController.predictDesies);

// API Routes for Predictions
router.post('/predict/heart-disease', isLoggedIn, userController.predictHeartDisease);
router.post('/predict/diabetes', isLoggedIn, userController.predictDiabetes);

module.exports = router;
