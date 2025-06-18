import User from '../models/user.model.js'
import { hash } from '../utils/hasher.js'
import { userDtoValidator } from '../utils/validators.js'
import responseService from '../services/response.service.js'
import 'dotenv/config'
 
export const getUser = async (req, res) => {
    try {
        res.status(200).json(req.user)
    } catch (error) {
        responseService.internalServerError(res, error)
    }
}

export const getUserByEmail = async (req, res) => {
    try {
        const email = req.params.email
        const user = await User.findOne({ email: email })
        
        if (!user) {
            return responseService.notFound(res, 'User')
        }

        return res.json(user)
    } catch (error) {
        responseService.internalServerError(res, error)
    }
}


export const updateUserCreds = async (req, res) => {
    try {
        const { email, name } = req.body

        const validationResult = userDtoValidator({
            email: email, 
            name: name
        })

        if (!validationResult.isValid) {
            return responseService.badRequest(res, 'Invalid credentials data', validationResult.errors)
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { email, name },
            { new: true }
        ).select('-password')

        if (!user) {
            return responseService.notFound(res, 'User')
        }

        res.status(200).json(user)
    } catch (error) {
        responseService.internalServerError(res, error)
    }
}

export const updateUserPassword = async (req, res) => {
    try {
        const { password } = req.body

        const validationResult = userDtoValidator({
            password: password
        })

        if (!validationResult.isValid) {
            return responseService.badRequest(res, 'Invalid password data', validationResult.errors)
        }

        const passwordHash = hash(password, process.env.HASH_KEY)
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { passwordHash },
            { new: true }
        ).select('-password')

        if (!user) {
            return responseService.notFound(res, 'User')
        }

        res.status(200).json(user)
    } catch (error) {
        responseService.internalServerError(res, error)
    }
}

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)

        if (!user) {
            return responseService.notFound(res, 'User')
        }

        responseService.deleted(res, 'User')
    } catch (error) {
        responseService.internalServerError(res, error)
    }
}