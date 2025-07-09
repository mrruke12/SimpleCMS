import Project from '../models/project.model.js'
import responseService from '../services/response.service.js'
import Commit from '../models/commit.model.js'
import DiffMatchPatch from 'diff-match-patch'

export const getCommitById = async (req, res) => {
    try {
        const id = req.params.id
        const commit = await Commit.findById(id).populate('authorId', '_id email name')
        
        if (!commit) {
            return responseService.notFound(res, 'Commit')
        }

        return res.json(commit)
    } catch (error) {
        responseService.internalServerError(res, error)
    }
}

export const getCommitsForProject = async (req, res) => {
    try {
        const id = req.params.id
        const project = await Project.findById(id)
        
        if (!Project) {
            return responseService.notFound(res, 'Project')
        }

        const commits = await Commit.find({ projectId: id }).sort({ createdAt: -1 }).populate('authorId', '_id email name')
        
        if (!commits) return res.json([])

        res.json(commits)
    } catch (error) {
        responseService.internalServerError(res, error)
    }
}

export const getDiffForCommit = async (req, res) => {
    try {
        const id = req.params.id

        const commit = await Commit.findById(id)

        if (!commit) {
            return responseService.notFound(res, 'Commit')
        }

        const dmp = new DiffMatchPatch()
        const diff = dmp.diff_main(commit.oldContent, commit.newContent)
        dmp.diff_cleanupSemantic(diff)
    
        res.json(diff)
    } catch (error) {
        responseService.internalServerError(res, error)
    }
}