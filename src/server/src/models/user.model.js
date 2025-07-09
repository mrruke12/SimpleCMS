import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    passwordHash: {type: String, required: true}
}, { versionKey: false} )

userSchema.methods.toJSON = function() {
    const user = this.toObject()
    delete user.passwordHash
    return user
}

export default mongoose.model('User', userSchema)