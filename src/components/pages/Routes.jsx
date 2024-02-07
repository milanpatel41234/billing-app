import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate  } from "react-router-dom";
import Login from "./Login";
import SignUp from "./SignUp";
import Dashboard from "./Dashboard";
import Header from "../helper/Header";
import Sidebar from "../helper/Sidebar";
import { useSelector } from "react-redux";

function AllRoutes() {
    const [rightSidebarActive , setRightSidebarActive] = useState(false); 
    const [leftSidebarActive , setLeftSidebarActive] = useState(true); 
    const Auth = useSelector((state) => state.Auth);

    const toggleRightSidebar = ()=> {
        setRightSidebarActive((prevrightSidebarActive)=> !prevrightSidebarActive)
    }
    const toggleLeftSidebar = ()=> {
        setLeftSidebarActive((prevleftSidebarActive)=> !prevleftSidebarActive)
    }

  return (
   <Router>
      <div className={`container-scroller ${!leftSidebarActive && 'sidebar-icon-only'}`}>
       {Auth.loginState && <Header toggleRightSidebar={toggleRightSidebar} toggleLeftSidebar={toggleLeftSidebar} />}
        <div className="container-fluid page-body-wrapper ">
        {Auth.loginState && <Sidebar rightSidebarActive={rightSidebarActive} />}
          <Routes>
            <Route path="/login" element={!Auth.loginState ? <Login/> : <Navigate to="/" />} />
            <Route path="/signup" element={!Auth.loginState ? <SignUp/> : <Navigate to="/" />} />
            <Route path="/"  element={Auth.loginState ? <Dashboard /> : <Navigate to="/login" />} />
          </Routes>
        </div>
     </div> 
     </Router>
  );
}

export default AllRoutes;
