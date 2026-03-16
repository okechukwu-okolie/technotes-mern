import mongoose from 'mongoose'


export const connectDB = async(key)=>{
      try {
        await mongoose.connect(key)
        console.log('Database connected sucessfully')
      } catch (error) {
        console.log(error)
      }
   
}