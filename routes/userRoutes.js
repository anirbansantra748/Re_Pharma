const express = require('express');
const passport = require('passport');
const router = express.Router();
const userController = require('../controllers/userController');
const { isLoggedIn } = require('../middleware/isLoggedIn');

router.get('/register', userController.renderRegister);
router.post('/register', userController.registerUser);
router.get('/login', userController.renderLogin);
router.post('/login', passport.authenticate('local', {
    failureRedirect: '/users/login',
    successRedirect: '/home',
}));
router.get('/logout', isLoggedIn, userController.logoutUser);
router.get('/profile', isLoggedIn, userController.renderProfile);
router.get('/chat/:id',userController.renderChat)
module.exports = router;
