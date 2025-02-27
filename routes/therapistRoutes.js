const express = require('express');
const router = express.Router();
const therapistController = require('../controllers/therapistController');
const { isLoggedIn } = require('../middleware/isLoggedIn');

// Therapist submits verification link
router.post('/submit-verification', therapistController.submitVerificationLink);

router.get('/search', therapistController.renderSearchPage); // Serve the search page
router.get('/find', therapistController.findTherapists);

// Therapist Verification Page
router.get('/verify', isLoggedIn, therapistController.renderVerificationPage);

// Therapist Dashboard
router.get('/dashboard', isLoggedIn, therapistController.renderTherapistDashboard);

router.get('/:id', therapistController.findTherapistProfile);

module.exports = router;
