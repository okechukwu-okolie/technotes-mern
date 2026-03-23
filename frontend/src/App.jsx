import './App.css'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Public from './components/Public.jsx'
import Login from './features/auth/Login.jsx'
import DashLayout from './components/DashLayout.jsx'
import Welcome from './features/auth/Welcome.jsx'
import NotesList from './features/notes/NotesList.jsx'
import UsersList from './features/users/UsersList.jsx'
import EditUser from './features/users/editUser.jsx'
import NewUserForm from './features/users/NewUserForm.jsx'
import EditNote from './features/notes/EditNote.jsx'
import NewNote from './features/notes/NewNote.jsx'
import Prefetch from './features/auth/PreFetch.jsx'





function App() {

  return (
    
    <Routes>
      {/* //public routes */}
      <Route path='/' element={<Layout/>}>
            <Route index element={<Public/>}/> 
            <Route path='login' element={<Login/>}/> 
      </Route>



      <Route element={<Prefetch/>}>
          {/* protected routes */}
          <Route path='dash' element={<DashLayout/>}>
      
            <Route index element={<Welcome/>}/>
      

            <Route path='users' >
              <Route index element={<UsersList/>}/>
              <Route path=':id' element={<EditUser/>}/>
              <Route path='new' element={<NewUserForm/>}/>
            </Route>
    
            <Route path='notes' >
              <Route index element={<NotesList/>}/>
               <Route path=':id' element={<EditNote/>}/>
              <Route path='new' element={<NewNote/>}/>
            </Route>

          </Route>
      </Route>
    </Routes>
  )
}

export default App
