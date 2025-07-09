import bcrypt from 'bcrypt'

export const hash = async (value, key) => {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(value, salt)
}

export const verify = async (value, hash) => {
    return await bcrypt.compare(value, hash)
} 