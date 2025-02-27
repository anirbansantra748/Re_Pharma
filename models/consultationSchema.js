const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    therapist: { type: mongoose.Schema.Types.ObjectId, ref: 'Therapist', required: true },
    date: { type: Date, required: true },
    prescription: { type: String }, // E-prescription link or text
    report: { type: String }, // Report link if any
    followUp: { type: Boolean, default: false }, // Flag for follow-ups
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Consultation', consultationSchema);
