import express from 'express'
import loginLimiter from '../middleware/loginlimiter.js' // Ensure .js is here
import { login, refresh, logout } from '../controllers/authController.js'

const route = express.Router()

// Middleware and Controller passed as separate arguments
route.post('/', loginLimiter, login)

route.get('refresh', refresh)

route.post('logout', logout)

export default route