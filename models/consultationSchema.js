const mongoose = require("mongoose");

const consultationSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    therapist: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["pending", "scheduled", "completed", "rejected"], default: "pending" },
    scheduledDate: { type: Date }, // Date assigned by therapist
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Consultation", consultationSchema);
