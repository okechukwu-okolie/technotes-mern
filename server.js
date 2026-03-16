import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url';//to use the __dirname, this line of code is important
import router from './routes/root.js';
import { logger, logEvents } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import { corsOptions } from './config/corsOptions.js';
import { connectDB } from './database/db.js';








dotenv.config()

const port = process.env.PORT || 5002
const app  = express()




const __filename = fileURLToPath(import.meta.url);//to use the __dirname, this line of code is important
const __dirname = path.dirname(__filename); //to use the __dirname, this line of code is important



//MIDDLEWARES 
app.use(logger)//this gives a log of the activities on the site
app.use(cors(corsOptions))// this connects the front andback ends together
app.use(express.json())//this allow json to be readable
app.use(cookieParser())// this allow for cookies
app.use('/',express.static(path.join(__dirname,'/public')))//internal middleware for static

//this provides a splash screen from the server side
app.use('/',router)

//take note of this for an api call for unavailable endpoints
app.all(/(.*)/,(req,res)=>{
    res.status(404)
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname,'/views/404.html'))
    }else if (req.accepts('json')) {
        res.json({ message: '404 Not Found' });
    } else {
        res.type('txt').send('404 Not Found');
    }
})



const key = process.env.DATABASE_URI

//this is a middleware that handles errors.  
app.use(errorHandler)

connectDB(key)
    app.listen(port,()=>{
        console.log('The server is running on port:', port)
    
})


