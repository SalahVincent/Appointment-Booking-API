import User from '../models/user.js'
import { comparePassword, generateToken, hashPassword } from '../utils/authUtils.js'

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

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isMatch = await comparePassword(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalied credentials' })
    }

    const token = generateToken(user)
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role
      }
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}