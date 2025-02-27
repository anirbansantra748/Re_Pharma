const User = require('../models/userSchema')
const Therapist = require('../models/therapistSchema');
//login
module.exports.renderLogin = (req, res) => {
    res.render('users/login.ejs');
};

//register postrout
module.exports.registerUser = async (req, res) => {
    try {
        const { username, email, password, gender, role, specialization, experience } = req.body;

        // Check if user already exists
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send("Email already exists!");
        }

        // Create new User
        const newUser = new User({ username, email, gender, role });

        // Register user with Passport
        const registeredUser = await User.register(newUser, password);

        // If user selects 'therapist', create Therapist profile
        if (role === "therapist") {
            const newTherapist = new Therapist({
                user: registeredUser._id, // Link to user
                specialization,
                experience,
            });
            await newTherapist.save();

            // Update User schema to reference therapist profile
            registeredUser.therapistProfile = newTherapist._id;
            await registeredUser.save();
        }

        res.redirect('/home'); // Redirect to login page after successful signup
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

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

        if (user.role === "therapist") {
            const therapist = await Therapist.findOne({ user: user._id }).lean();
            return res.render("pages/profile.ejs", { user, therapist });
        }

        res.render("pages/profile.ejs", { user, therapist: null });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports.renderChat = async (req, res) => {
    try {
        const recipient = await User.findById(req.params.id).lean();

        if (!recipient) {
            return res.status(404).send("User not found");
        }

        res.render('pages/chatTherapist.ejs', { recipient, user: req.user });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}
