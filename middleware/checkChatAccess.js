const Consultation = require("../models/consultationSchema");

module.exports.checkChatAccess = async (req, res, next) => {
    try {
        const therapistId = req.params.id;
        const patientId = req.user._id;

        const consultation = await Consultation.findOne({
            patient: patientId,
            therapist: therapistId,
            status: "scheduled"
        });

        if (!consultation) {
            return res.status(403).send("Unauthorized access to chat.");
        }

        const today = new Date().setHours(0, 0, 0, 0);
        const consultationDate = new Date(consultation.scheduledDate).setHours(0, 0, 0, 0);

        if (today !== consultationDate) {
            return res.status(403).send("Chat is only available on the scheduled consultation day.");
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};
