import asyncHandler from '../../middleware/asyncHandler.js'
import User from '../../models/userModel.js'

// @desc    Get users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({})
    res.status(200).json(users)
})

// @desc    Delete users
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)

    if (user) {
        if (user.isAdmin) {
            res.status(400)
            throw new Error('Cannot delete admin user!')
        }
        await User.deleteOne({ _id: user._id })
        res.status(200).json('Deleted successfully')

    } else {
        res.status(404)
        throw new Error('User not found')
    }

})

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password')
    if (user) {
        res.status(200).json(user)
    } else {
        res.status(404)
        throw new Error('Resource not found')
    }
})

// @desc    Update user by id
// @route   PUT /api/users/:id
// @access  Private/Admin
const updatedUserbyId = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)

    if (user) {
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        user.isAdmin = Boolean(req.body.isAdmin)

        const updatedUser = await user.save()
        res.status(200).json(updatedUser)
    }
})

export {
    updatedUserbyId,
    getUsers,
    getUserById,
    deleteUser
}
