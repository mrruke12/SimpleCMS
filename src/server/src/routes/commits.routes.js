import express from 'express'
import { getCommitById, getCommitsForProject, getDiffForCommit } from '../controllers/commit.controller.js'
import { protect } from '../middlewares/auth.middleware.js'

const router = express.Router()
router.get('/diff/:id', protect, getDiffForCommit)
router.get('/by-id/:id', protect, getCommitById)
router.get('/by-project/:id', protect, getCommitsForProject)

export default router