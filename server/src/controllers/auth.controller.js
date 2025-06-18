import User from '../models/user.model.js'
import responseService from '../services/response.service.js'
import { userDtoValidator } from '../utils/validators.js'
import { hash, verify } from '../utils/hasher.js'
import { generateToken } from '../services/token.service.js'

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body

        const validationResult = userDtoValidator({
            email: email,
            name: name,
            password: password
        })

        if (!validationResult.isValid) {
            return responseService.badRequest(res, 'User invalid data', validationResult.errors)
        }

        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return responseService.conflict(res, 'User email conflict')
        }

        console.log(process.env.HASH_KEY)
        const passwordHash = await hash(password, process.env.HASH_KEY)
        const user = new User({ email, name, passwordHash })
        await user.save()

        res.status(201).json(user.toJSON())
    } catch (error) {
        responseService.internalServerError(res, error)
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (email == null || password == null) {
            return responseService.badRequest(res, 'Login invalid data')
        }

        const user = await User.findOne({ email })
        
        if (!user) {
            return responseService.notFound(res, 'User')
        }

        if (!verify(password, user.passwordHash)) {
            return res.status(401)
        }

        return res.status(200).json(generateToken(user._id))
    } catch (error) {
        responseService.internalServerError(res, error)
    }
}