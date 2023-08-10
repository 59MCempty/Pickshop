import asyncHandler from '../../middleware/asyncHandler.js'
import User from '../../models/userModel.js'
import generateToken from '../../utils/generateToken.js'
import jwt from 'jsonwebtoken'


// @desc    Auth and get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (user && (await user.matchPassword(password))) {
        generateToken(res, user._id)

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        })
    } else {
        res.status(401)
        throw new Error('Invalid Email or password!')
    }
})

// @desc    Register User
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body
    const existUser = await User.findOne({ email })
    if (existUser) {
        res.status(400)
        throw new Error('User already exits')
    }

    const newUser = await User.create({ name, email, password })

    if (newUser) {
        generateToken(res, newUser._id)
        res.json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            isAdmin: newUser.isAdmin
        })
    } else {
        res.status(400)
        throw new Error('Invalid User data')
    }

})

// @desc    Logout User / Clear cookies
// @route   POST /api/users/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {

    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    })

    res.status(200).json({ message: 'Logged out successfully!' })
})

// @desc    Get profile user
// @route   GET /api/users/mine
// @access  Public
const getUserProfile = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user._id)
    if (user) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)

    if (user) {
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        if (req.body.password) {
            user.password = req.body.password
        }
    }
    const updatedUser = await user.save()
    res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin
    })
})


export {
    authUser,
    logoutUser,
    registerUser,
    getUserProfile,
    updateUserProfile
}






