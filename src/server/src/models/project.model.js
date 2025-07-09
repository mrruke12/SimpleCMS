import mongoose from "mongoose"

const projectSchema = new mongoose.Schema({
    name: {type: String, required: true},
    content: {type: String, required: true},
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    coAuthors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }]
}, { versionKey: false })

export default mongoose.model('Project', projectSchema)