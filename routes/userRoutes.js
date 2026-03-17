import express from 'express'
import { getAllUsers,deleteUsers,creatNewUsers,updateUsers } from '../controllers/usersControlllers.js'


const userRoute = express.Router()

userRoute.get('/',getAllUsers)
userRoute.post('/',creatNewUsers)
userRoute.patch('/',updateUsers)
userRoute.delete('/',deleteUsers)









export default userRoute