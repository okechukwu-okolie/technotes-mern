import express from 'express'
import { getAllNotes,deleteNote,updateNote, createNewNote } from '../controllers/noteControllers.js'
import verifyJWT from '../middleware/verifyJWT.js'

const noteRoute = express.Router()
//using the use function this way allows us use the verify JWT middle ware on all the routes
noteRoute.use(verifyJWT)

noteRoute.get('/',getAllNotes)
noteRoute.post('/',createNewNote)
noteRoute.patch('/',updateNote)
noteRoute.delete('/',deleteNote)


export default noteRoute