import User from '../model/User.js'
import Note from '../model/Note.js'
import bcrypt from 'bcrypt'
import asyncHandler from 'express-async-handler'



//GET
export const getAllUsers = asyncHandler(async(req,res)=>{
   const users = await User.find().select('-password').lean() 
   if(!users?.length){
    return res.status(400).json({message:'No users found'})
   }
   res.status(200).json(users)
})


//POST
export const creatNewUsers = asyncHandler(async(req,res)=>{

    //destructure from the frontend input
  const{username, password, roles} = req.body

  if(!username || !password || !Array.isArray(roles) || !roles.length){
    return res.status(400).json({message:'All fields are required'})
  }


  //check for duplicate username
  const duplicate =await User.findOne({username}).lean().exec()
  if(duplicate){
    return res.status(409).json({message:'Duplicate username'})
  }


  //hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  const userObject = {username,'password':hashedPassword, roles}

  //create and store new user
  const user = await User.create(userObject)

  //validating created user
  if(user){
    res.status(201).json({message:`New user ${username} created`})
  }else{
    res.status(400).json({message:'Invalid user data received'})
  }
})



//EDIT
export const updateUsers = asyncHandler(async(req,res)=>{
 const {id, username, roles, active, password} = req.body

 if(!id || !username || !Array.isArray(roles) ||!roles.length || typeof active !== 'boolean'){
    return res.status(400).json({message: 'All fields are required'})
 }

 //storing the retrieved user data in the user variable
 const user = await User.findById(id).exec()

 if(!user){
    return res.status(400).json({message:'User not found'})
 }

 //check fro duplicate
 const duplicate = await User.findOne({username}).lean().exec()

 //allow updates to the original user
 if(duplicate && duplicate?._id.toString() !== id){
    return res.status(409).json({message:'Duplicate username'})
 }

 user.username = username
 user.roles = roles
 user.active = active

 if(password){
    user.password = await bcrypt.hash(password, 10)
 }

 //the reason why we have avoided the lean() method is because we have to use the save() method.
 const updatedUser = await user.save()

 res.json({message:`${updatedUser.username} updated`})

})




//DELETE
export const deleteUsers = asyncHandler(async(req,res)=>{
    const {id} = req.body

    if(!id){
        return res.status(400).json({message:'User ID required'})
    }

    //we need to check the note model to verify that the user does not have assigned notes
    const note = await Note.findOne({user:id}).lean().exec()

    if(note){
        return res.status(400).json({message:'user has assigned notes'})
    }

    const user = await User.findById(id).exec()

    if(!user){
        return res.status(400).json({message: 'User not found'})
    }

     const result = await user.deleteOne()

     const reply = `Username ${result.username} with ID ${result._id} deleted`

     res.json(reply)
})