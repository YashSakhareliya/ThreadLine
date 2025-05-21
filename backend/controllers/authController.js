const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');


const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    // Validate input fields
    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: "All fields are required." });
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Please provide a valid email." });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }

    try {
        // Check if the email already exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: "Email already in use." });
        }

        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role,
        });

        // Save the user to the database
        await newUser.save();

        // Generate a JWT token
      

        // Respond with a success message and the JWT token
        res.status(201).json({
            message: "User registered successfully!",
        
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Please provide email and password." });
    }

    try {
        // Check if the user exists
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        // Compare the password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        // Generate JWT token
      // Example from login route:
const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15d' }
);

const options = {
    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),  // 3 days expiration
    httpOnly: true,  
    secure: process.env.NODE_ENV === 'production',  // true for production, false for local dev
    sameSite: 'None'  // For cross-origin requests
};

// Sending the token in a cookie
res.cookie('token', token, options).status(200).json({
    success: true,
    token,
    user,
    message: 'User Login Success',
});

        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};


module.exports = { registerUser, loginUser };
