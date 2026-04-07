import mongoose from "mongoose";
// 1. Import the factory function from the package
import { default as AutoIncrementFactory } from 'mongoose-sequence';

// 2. Initialize the plugin by passing the mongoose instance

const AutoIncrement = AutoIncrementFactory(mongoose);
const Schema = mongoose.Schema

const noteSchema = new Schema({
    
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    title:{
        type:String,
        required:true
    },
    text:{
        type:String,  
        required:true
    },
    completed:{
        type:Boolean,
        default: 'false'
    }
},
{timestamps:true}
)

noteSchema.plugin(AutoIncrement,{
    inc_field:'ticket',
    id:'ticketNums',
    start_seq: 500
})

const Note = mongoose.model('Note', noteSchema)

export default Note