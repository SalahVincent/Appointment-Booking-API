import User from '../models/user.js'
import { hashPassword } from '../utils/authUtils.js'

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' })
    }

    const hashedPassword = await hashPassword(password)

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'client'
    })

    res.status(201).json({ 
      message: 'User registered!', 
      userId: newUser.id
    })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}