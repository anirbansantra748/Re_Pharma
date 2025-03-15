require("dotenv").config();
const User = require('../models/userSchema')
const axios = require('axios');
const Therapist = require('../models/therapistSchema');
const Consultation = require('../models/consultationSchema');
const { isLoggedIn } = require('../middleware/isLoggedIn');
const wrapAsync = require('../middleware/wrapAsync');
//login
module.exports.renderLogin = (req, res) => {
    res.render('users/login.ejs');
};


module.exports.registerUser = wrapAsync(async (req, res) => {
    try {
        const {
            username,
            email,
            password,
            gender,
            role,
            specialization,
            experience,
            wholeName,
            description,
            phone,
            location,
            emergencyContacts,
        } = req.body;

        // Check if user already exists
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send("Email already exists!");
        }

        // Parse emergency contacts properly
        let parsedEmergencyContacts = [];
        if (emergencyContacts && Array.isArray(emergencyContacts)) {
            parsedEmergencyContacts = emergencyContacts.map(contact => ({
                name: contact.name,
                phoneNumber: contact.phoneNumber,
            }));
        }

        // Create new User
        const newUser = new User({
            username,
            email,
            gender,
            role,
            emergencyContacts: parsedEmergencyContacts, // Store emergency contacts
        });

        // Register user with Passport
        const registeredUser = await User.register(newUser, password);

        // If the user is a therapist, create Therapist profile
        let therapistProfile = null;
        if (role === "therapist") {
            therapistProfile = new Therapist({
                user: registeredUser._id,
                wholeName,
                location,
                specialization,
                description,
                experience,
                phone: phone || "N/A",
                location: location || "Unknown",
            });
            await therapistProfile.save();

            // Link therapist profile to the user
            registeredUser.therapistProfile = therapistProfile._id;
            await registeredUser.save();
        }

        res.redirect("/home"); // Redirect to home or login page
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
})

//register
module.exports.renderRegister = (req,res)=>{
    res.render('users/signup.ejs')
}

//logout rout
module.exports.logoutUser = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect('/home');
    });
};

//profile
module.exports.renderProfile = async (req, res) => {
	try {
		const user = await User.findById(req.user._id).lean();

		if (!user) {
			return res.status(404).send("User not found");
		}

		let therapist = null;
		if (user.role === "therapist") {
			therapist = await Therapist.findOne({ user: user._id }).lean();
		}

		const searchQuery = req.query || {}; // Ensure searchQuery is always passed

		res.render("pages/profile.ejs", { user, therapist, searchQuery });
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal Server Error");
	}
};


// module.exports.renderChat = async (req, res) => {
//     try {
//         const recipient = await User.findById(req.params.id).lean();

//         if (!recipient) {
//             return res.status(404).send("User not found");
//         }

//         res.render('pages/chatTherapist.ejs', { recipient, user: req.user });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send("Internal Server Error");
//     }
// }

module.exports.renderChat = async (req, res) => {
    try {
        const therapistId = req.params.id;
        const patientId = req.user._id;

        // Find a scheduled consultation for today
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const consultation = await Consultation.findOne({
            patient: patientId,
            therapist: therapistId,
            status: "scheduled",
            scheduledDate: { $eq: today }
        });

        // if (!consultation) {
        //     return res.status(403).send("Chat is only available on the consultation day.");
        // }

        // Proceed to chat if allowed
        const recipient = await User.findById(therapistId).lean();
        res.render("pages/chatTherapist.ejs", { recipient, user: req.user });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports.predictDesies = (req, res) => {
    res.render('pages/predictDisease.ejs', { prediction: null });
};

module.exports.predictHeartDisease = async (req, res) => {
    try {
        const { userId } = req.body;
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

        const userSymptoms = JSON.stringify(req.body);

        const prompt = `
            You are a medical AI assistant. Based on the given symptoms, assess the risk of heart disease.
            Respond with only one of the following: "Likelihood: High", "Likelihood: Medium", or "Likelihood: Low".
            Symptoms: ${userSymptoms}
        `;

        const response = await axios.post(GEMINI_API_URL, {
            contents: [{ role: "user", parts: [{ text: prompt }] }]
        });

        let prediction = response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "No result";
        const validResponses = ["Likelihood: High", "Likelihood: Medium", "Likelihood: Low"];
        if (!validResponses.includes(prediction)) {
            prediction = "Likelihood: Unable to determine";
        }

        // Store in medicalRecords
        const user = await User.findById(userId);
        if (user) {
            user.medicalRecords.push({
                recordType: "Heart Disease",
                heartDiseaseRisk: prediction.split(": ")[1] // Extract "High", "Medium", or "Low"
            });
            await user.save();
        }

        res.render("pages/predictDisease.ejs", { prediction });
    } catch (error) {
        console.error("Error predicting heart disease:", error.response?.data || error.message);
        res.render("pages/predictDisease.ejs", { prediction: "Error predicting heart disease" });
    }
};

module.exports.predictDiabetes = async (req, res) => {
    try {
        const { userId, sugarLevel } = req.body;
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

        const prompt = `
            Given the following symptoms, assess the likelihood of diabetes.
            Symptoms: Sugar Level = ${sugarLevel}
            Response format: "Likelihood: High/Medium/Low".
        `;

        const response = await axios.post(GEMINI_API_URL, {
            contents: [{ role: "user", parts: [{ text: prompt }] }]
        });

        let prediction = response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "No result";
        const validResponses = ["Likelihood: High", "Likelihood: Medium", "Likelihood: Low"];
        if (!validResponses.includes(prediction)) {
            prediction = "Likelihood: Unable to determine";
        }

        // Store in medicalRecords
        const user = await User.findById(userId);
        if (user) {
            user.medicalRecords.push({
                recordType: "Diabetes",
                sugarLevel,
                diabetesRisk: prediction.split(": ")[1] // Extract "High", "Medium", or "Low"
            });
            await user.save();
        }

        res.render("pages/predictDisease.ejs", { prediction });
    } catch (error) {
        console.error(error);
        res.render("pages/predictDisease.ejs", { prediction: "Error predicting diabetes" });
    }
};
