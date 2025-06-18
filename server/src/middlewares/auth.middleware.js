import { verifyToken } from "../services/token.service.js"
import User from '../models/user.model.js'

export const protect = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]
    req.user = null

    if (token) {
        const decoded = verifyToken(token)
        const user = await User.findById(decoded.id)
        
        if (user) {
            req.user = user
        }
    }
    if (req.user) next()
    else return res.status(401)
}