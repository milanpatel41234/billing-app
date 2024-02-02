import React from 'react'
import { BrowserRouter as Router , Route , Routes } from 'react-router-dom';
import Login from './Login';
import SignUp from './SignUp';


function AllRoutes() {
  return (
    <>
       <Router>
        <Routes>
          <Route path='/' element={<Login/>}/>
          <Route path='/signup' element={<SignUp/>}/>
        </Routes>
      </Router>
      </>
  )
}

export default AllRoutes
