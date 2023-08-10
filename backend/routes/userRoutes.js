import express from 'express'

import { protect, admin } from '../middleware/authMiddleware.js'
import {
    authUser,
    logoutUser,
    registerUser,
    getUserProfile,
    updateUserProfile
} from '../controllers/users/usersController.js'

import {
    updatedUserbyId,
    getUsers,
    getUserById,
    deleteUser
} from '../controllers/users/adminUserController.js'

const router = express.Router()

router.route('/').post(registerUser).get(protect, admin, getUsers)
router.post('/logout', logoutUser)
router.post('/login', authUser)
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile)
router.route('/:id').delete(protect, admin, deleteUser).get(protect, admin, getUserById).put(protect, admin, updatedUserbyId)

export default router
