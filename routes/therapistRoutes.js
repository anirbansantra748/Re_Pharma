const express = require('express');
const router = express.Router();
const therapistController = require('../controllers/therapistController');
const { isLoggedIn } = require('../middleware/isLoggedIn');
const wrapAsync = require('../middleware/wrapAsync')

// Therapist submits verification link
router.post('/submit-verification',isLoggedIn, therapistController.submitVerificationLink);

router.get('/search',isLoggedIn, therapistController.renderSearchPage); // Serve the search page
router.get('/find',isLoggedIn, therapistController.findTherapists);

// Therapist Verification Page
router.get('/verify', isLoggedIn, therapistController.renderVerificationPage);

// Therapist Dashboard
router.get('/dashboard', isLoggedIn, therapistController.renderTherapistDashboard);

router.get('/:id',isLoggedIn, therapistController.findTherapistProfile);

module.exports = router;
