const Therapist = require('../models/therapistSchema');
const User = require('../models/userSchema');

// ✅ Render the Therapist Verification Page
module.exports.renderVerificationPage = async (req, res) => {
    if (req.user.role !== "therapist") {
        return res.status(403).send("Unauthorized! Only therapists can access this page.");
    }

    const therapist = await Therapist.findOne({ user: req.user._id });
    res.render('pages/verify.ejs', { therapist });
};

// ✅ Therapist Submits Multiple Verification Links
module.exports.submitVerificationLink = async (req, res) => {
    try {
        let { verificationLinks } = req.body; // Get multiple links as an array
        if (!Array.isArray(verificationLinks)) {
            verificationLinks = [verificationLinks]; // Convert to array if single input
        }

        const therapist = await Therapist.findOne({ user: req.user._id });

        if (!therapist) {
            return res.status(400).send("Therapist profile not found!");
        }

        therapist.verificationDocuments.push(...verificationLinks); // Add new links
        therapist.isVerified = true
        await therapist.save();

        res.redirect('/home'); // Redirect to verification page
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

// ✅ Render the search page with all therapists initially
module.exports.renderSearchPage = async (req, res) => {
    try {
        const therapists = await Therapist.find().populate('user'); // Get all therapists with user details
        res.render('pages/findTherapists', { therapists, searchQuery: {} });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

// ✅ Search therapists based on name, specialization, role, or verification status
module.exports.findTherapists = async (req, res) => {
    try {
        let { name, specialization, isVerified } = req.query;
        let filter = {};

        // Convert string to boolean for isVerified filter
        if (isVerified !== undefined && isVerified !== "") {
            filter.isVerified = isVerified === "true";
        }
        if (specialization) {
            filter.specialization = { $regex: new RegExp(specialization, "i") }; // Case-insensitive
        }

        // Find therapists with the filter
        let therapists = await Therapist.find(filter).populate('user');

        // Apply name filter from the User model
        if (name) {
            therapists = therapists.filter(t =>
                t.user.username.toLowerCase().includes(name.toLowerCase())
            );
        }

        res.render('pages/findTherapists', { therapists, searchQuery: req.query });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

//chats
module.exports.renderChatPage = async (req, res) => {
    res.render('pages/chat.ejs');
}

module.exports.findTherapist =  async (req, res) => {
    try {
        const therapist = await Therapist.findById(req.params.id).populate('user').lean();

        if (!therapist) {
            return res.status(404).send("Therapist not found");
        }

        res.render('pages/therapistProfile.ejs', { therapist });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};
