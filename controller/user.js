const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError } = require('../errors/bad_request');
const { UnauthenticatedError } = require('../errors/unauthenticated');

const register = async (req, res) => {
    try {
        const user = await User.create({ ...req.body });
        const token = user.createJWT();
        res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
    } catch (error) {
        console.error("Registration Error:", error);  // Log the actual error
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Registration failed' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
        throw new BadRequestError('Please provide email and password');
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
        throw new UnauthenticatedError('Invalid credentials');
    }

    // Compare passwords
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('Incorrect password');
    }

    // Generate JWT token and respond
    const token = user.createJWT();
    res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = {
    register,
    login,
};
