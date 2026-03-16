import {format} from 'date-fns'
import {v4 as uuid} from 'uuid'
import fs from 'fs'
import fsPromises from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);//to use the __dirname, this line of code is important
const __dirname = path.dirname(__filename); //to use the __dirname, this line of code is important


export const logEvents = async(message, logFileName)=>{
    const dateTime = format(new Date(), 'yyyy-MM-dd\tHH:mm:ss');
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

    try {
        if(!fs.existsSync(path.join(__dirname,'../logs'))){
            await fsPromises.mkdir(path.join(__dirname,'../logs'))
        }
        await fsPromises.appendFile(path.join(__dirname,'../logs',logFileName),logItem)
    } catch (error) {
        console.log(error)
    }   
}

//THE ACTUAL MIDDLEWARE
export const logger = (req,res,next)=>{
logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqLog.log')

// console.log(`${req.method} ${req.path }`)

next()
}

