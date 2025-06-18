import jwt from 'jsonwebtoken'
import 'dotenv/config'

const JWT_SECRET = process.env.JWT_SECRET
const EXPIRES_IN = `${process.env.JWT_LIFETIME}d`

export const generateToken = (userId) => {
    return jwt.sign({ id: userId}, JWT_SECRET, { expiresIn: EXPIRES_IN })
}

export const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET)
}