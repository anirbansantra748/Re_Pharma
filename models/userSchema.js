const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ["patient", "therapist"], required: true },

    profilePicture: { type: String, default: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmir-s3-cdn-cf.behance.net%2Fproject_modules%2Fmax_1200%2F626fd8140423801.6241b91e24d9c.png&f=1&nofb=1" },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },

    // Patient Fields
    emergencyContacts: [
        {
            name: { type: String },
            phoneNumber: { type: String },
        },
    ],

    // Medical Records with structured data
    medicalRecords: [
        {
            date: { type: Date, default: Date.now },  // Timestamp of record
            recordType: { type: String, enum: ["General", "Diabetes", "Heart Disease"], required: true },
            sugarLevel: { type: Number },  // Sugar level for diabetes
            diabetesRisk: { type: String, enum: ["Low", "Medium", "High"] }, // Diabetes risk
            heartDiseaseRisk: { type: String, enum: ["Low", "Medium", "High"] } // Heart disease risk
        }
    ],

    consultations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Consultation' }],

    therapistProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'Therapist' },

    createdAt: { type: Date, default: Date.now },
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);

