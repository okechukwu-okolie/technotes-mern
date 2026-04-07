import express from 'express'
import { getAllUsers,deleteUsers,creatNewUsers,updateUsers, getUser } from '../controllers/usersControlllers.js'
import verifyJWT from '../middleware/verifyJWT.js'


const userRoute = express.Router()
//using the use function this way allows us use the verify JWT middle ware on all the routes
userRoute.use(verifyJWT)


userRoute.get('/:id', getUser)
userRoute.get('/',getAllUsers)
userRoute.post('/',creatNewUsers)
userRoute.patch('/',updateUsers)
userRoute.delete('/',deleteUsers)









export default userRoute