const Consultation = require("../models/consultationSchema");
const User = require("../models/userSchema");

module.exports.requestConsultation = async (req, res) => {
    try {
        const therapistId = req.params.id;
        const patientId = req.user._id;

        // Check if there's already a pending consultation
        const existingConsultation = await Consultation.findOne({ patient: patientId, therapist: therapistId, status: "pending" });
        if (existingConsultation) {
            return res.status(400).send("You already have a pending request.");
        }

        // Create new consultation request
        const consultation = new Consultation({ patient: patientId, therapist: therapistId });
        await consultation.save();

        res.redirect("/home");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports.scheduleConsultation = async (req, res) => {
    try {
        const { scheduledDate } = req.body;
        const consultation = await Consultation.findById(req.params.id);

        if (!consultation || consultation.therapist.toString() !== req.user._id.toString()) {
            return res.status(403).send("Unauthorized");
        }

        consultation.status = "scheduled";
        consultation.scheduledDate = new Date(scheduledDate);
        await consultation.save();

        res.redirect("/therapists/dashboard");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};
