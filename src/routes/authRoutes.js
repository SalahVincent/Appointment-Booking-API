import express from 'express'
import { register, login } from '../controllers/authController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)

router.get('/profile', protect, (req, res) => {
    res.status(200).json({
        message: "Welcome to your private profile",
        yourUserId: req.user
    })
})

export default router