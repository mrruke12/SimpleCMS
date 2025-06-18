import express from 'express'
import { addProject, getProjects, updateContent, getProjectById, updateCoAuthors, deleteProject, getPdf } from '../controllers/projects.controller.js'
import { protect } from '../middlewares/auth.middleware.js'

const router = express.Router()
router.get('/', protect, getProjects)
router.get('/:id', protect, getProjectById)
router.get('/:id/pdf', protect, getPdf)
router.delete('/:id', protect, deleteProject)
router.post('/', protect, addProject)
router.put('/:id/content', protect, updateContent)
router.put('/:id/coauthors', protect, updateCoAuthors)

export default router