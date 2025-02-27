const mongoose = require('mongoose');

const therapistSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User
    specialization: { type: String, required: true },
    experience: { type: Number, required: true }, // Years of experience

    rating: { type: Number, default: 0 }, // Average rating
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }], // References patient reviews

    verificationDocuments: [{ type: String }], // Array of document URLs
    isVerified: { type: Boolean, default: false }, // Therapist verification status

    consultations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Consultation' }], // Consultation history

    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Therapist', therapistSchema);
