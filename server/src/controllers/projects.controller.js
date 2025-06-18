import Project from '../models/project.model.js'
import User from '../models/user.model.js'
import { coAuthorsValidator, projectDtoValidator} from '../utils/validators.js'
import responseService from '../services/response.service.js'
import Commit from '../models/commit.model.js'
import { response } from 'express'
import { hasAccess } from '../utils/access.js'
import { mdToPdf } from '../services/pdf.service.js'

export const addProject = async (req, res) => {
    try {
        const { name } = req.body

        const validationResult = projectDtoValidator(name)

        if (!validationResult.isValid) {
            return responseService.badRequest(res, "Project name invalid data", validationResult.errors)
        }

        const content = " "
        const author = req.user._id

        const project = new Project({ name, content, author })
        project.save()

        return res.status(201).json(project)
    } catch (error) {
        responseService.internalServerError(res, error)
    }
}

export const deleteProject = async (req, res) => {
    try {
        const projectId = req.params.id
        const project = await Project.findById(projectId)

        if (!project) {
            return responseService.notFound(res, 'Project')
        }

        if (project.author.toString() !== req.user._id.toString()) {
            return responseService.forbid(res)
        }

        await Project.findByIdAndDelete(projectId)

        res.json({ message: 'deleted' })
    } catch (error) {
        responseService.internalServerError(res, error)
    }
}

export const getProjects = async (req, res) => {
    try {
        const userId = req.user._id

        const projects = await Project.find({ $or: [{ author: userId }, { coAuthors: userId }] })

        return res.json(projects)
    } catch (error) {
        responseService.internalServerError(res, error)
    } 
}

export const getProjectById = async (req, res) => {
    try {
        const projectId = req.params.id

        const project = await Project.findById(projectId).populate('author coAuthors', '_id name email')

        if (!project) {
            return responseService.notFound(res, 'Project')
        }
        
        return res.json(project)
    } catch (error) {
        responseService.internalServerError(res, error)
    }
} 

export const updateContent = async (req, res) => {
    try {
        const projectId = req.params.id
        const { content: newContent } = req.body
        const authorId = req.user._id

        if (newContent === '') newContent = ' '

        if (!newContent) {
            return responseService.badRequest(res, 'No content for project')
        }

        const project = await Project.findById(projectId)

        if (!project) {
            return responseService.notFound(res, 'Project')
        }

        if (!hasAccess(authorId, { authorId: project.author, coAuthors: project.coAuthors })) {
            return responseService.forbid(res)
        }

        const oldContent = project.content

        project.content = newContent
        await project.save()

        const commit = new Commit({
            projectId,
            authorId,
            oldContent,
            newContent
        })

        await commit.save()

        res.json({ project })
    } catch (error) {
        responseService.internalServerError(res, error)
    }
}

export const updateCoAuthors = async (req, res) => {
    try {
        const projectId = req.params.id
        const { coAuthors } = req.body

        const project = await Project.findById(projectId)

        if (!project) {
            return responseService.notFound(res, 'Project')
        }

        if (project.author.toString() !== req.user._id.toString()) {
            return responseService.forbid(res)
        }


        project.coAuthors = coAuthors
        await project.save()

        res.json({ project })
    } catch (error) {
        responseService.internalServerError(res, error)
    }
}

export const getPdf = async (req, res) => {
    try {
        const id = req.params.id

        const project = await Project.findById(id)

        if (!project) {
            return responseService.notFound(res, 'Project')
        }

        mdToPdf(res, project.content)
    } catch (error) {
        responseService.internalServerError(res, error)
    }
}