import express from 'express'
import { 
    getUser, 
    updateUserCreds, 
    updateUserPassword, 
    deleteUser,
    getUserByEmail
} from '../controllers/users.controller.js'
import { protect } from '../middlewares/auth.middleware.js'

const router = express.Router()
router.get('/', protect, getUser)
router.get('/:email', protect, getUserByEmail)
router.delete('/', protect, deleteUser)
router.put('/update-creds', protect, updateUserCreds)
router.put('/update-password', protect, updateUserPassword)

export default router