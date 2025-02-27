const mongoose = require('mongoose');

const therapistSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User
    specialization: { type: String, required: true },
    experience: { type: Number, required: true }, // Years of experience
    profileImage: { type: String, default: "/images/default-profile.jpg" }, // Therapist's profile image
    phone: { type: String, default: "N/A" }, // Contact number
    email: { type: String, default: "N/A" }, // Email address
    location: { type: String, default: "Unknown" }, // Location

    rating: { type: Number, default: 0 }, // Average rating
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }], // References patient reviews

    verificationDocuments: [{ type: String }], // Array of document URLs
    isVerified: { type: Boolean, default: false }, // Therapist verification status

    consultations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Consultation' }], // Consultation history

    social: {
        facebook: { type: String, default: "" },
        twitter: { type: String, default: "" },
        instagram: { type: String, default: "" }
    }, // Social media links

    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Therapist', therapistSchema);
