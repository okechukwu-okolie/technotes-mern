import express from 'express'
import { getAllNotes,deleteNote,updateNote, createNewNote } from '../controllers/noteControllers.js'


const noteRoute = express.Router()


noteRoute.get('/',getAllNotes)
noteRoute.post('/',createNewNote)
noteRoute.patch('/',updateNote)
noteRoute.delete('/',deleteNote)


export default noteRoute