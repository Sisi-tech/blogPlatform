const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError } = require('../errors/bad_request');
const { UnauthenticatedError } = require('../errors/unauthenticated')

const register = async (req, res) => {
    const user = await User.create({ ...req.body })
    const token = user.createJWT();
    res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
}

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new BadRequestError('Please provide email and password');
    }
    const user = await User.findOne({ email })
    if (!user) {
        throw new UnauthenticatedError('Invalid credentials');
    }
    const isPasswordCorrect = await user.comparePassword(password)
    if (!password) {
        throw new UnauthenticatedError('Incorrect password');
    }
    const token = user.createJWT();
    res.status(StatusCode.OK).json({user: { name: user.name }, token});
}

module.exports = {
    register, 
    login,
}