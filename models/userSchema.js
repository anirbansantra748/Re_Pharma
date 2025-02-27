const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ["patient", "therapist"], required: true }, // Role selection

    profilePicture: { type: String, default: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmir-s3-cdn-cf.behance.net%2Fproject_modules%2Fmax_1200%2F626fd8140423801.6241b91e24d9c.png&f=1&nofb=1" },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },

    // Patient Fields
    emergencyContacts: [
        {
            name: { type: String },
            phoneNumber: { type: String },
        },
    ],
    medicalRecords: [{ type: String }], // Secure links to medical history files

    consultations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Consultation' }], // Consultation history

    // Therapist Reference (if user is a therapist)
    therapistProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'Therapist' },

    createdAt: { type: Date, default: Date.now },
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);
