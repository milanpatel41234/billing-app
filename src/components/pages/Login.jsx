import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from 'react-hot-toast';


function Login() {
   const [data , setData] = useState({
    email:'',
    password:'',
   })


    const handleChange = (e) => {
        setData({ ...data, [e.target.id]: e.target.value })

    };
    const handleSubmit = (e)=>{
        e.preventDefault();
        if(!data.email.includes('@')){
            toast.error('Please enter a valid email address');
            return
          }else if( data.password.length < 8){
            toast.error('Password must be at least 8 characters');
            return
          }
          console.log(data)
    }

  return (
    <div className="container-scroller">
      <div className="container-fluid page-body-wrapper full-page-wrapper">
        <div className="content-wrapper d-flex align-items-center auth px-0">
          <div className="row w-100 mx-0">
            <div className="col-lg-4 mx-auto">
              <div className="auth-form-light text-left py-5 px-4 px-sm-5">
                <div className="brand-logo">
                  <h3>EXFI</h3>
                </div>
                <h4>Hello! let's get started</h4>
                <h6 className="fw-light">Sign in to continue.</h6>
                <form className="pt-3">
                  <div className="form-group">
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      id="email"
                      placeholder="Email address"
                      autoComplete="current-password"
                     onChange={handleChange}
                     value={data.email}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      id="password"
                      placeholder="Password"
                      autoComplete="current-password"
                      onChange={handleChange}
                     value={data.password}
                    />
                  </div>
                  <div className="mt-3">
                    <button
                      className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
                   onClick={handleSubmit} >
                      SIGN IN
                    </button>
                  </div>
                  <div className="my-2 d-flex justify-content-between align-items-center">
                    <div className="form-check">
                      <label className="form-check-label text-muted">
                        <input type="checkbox" className="form-check-input" />
                        Keep me signed in
                      </label>
                    </div>
                    <Link href="/" className="auth-link text-black">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="mb-2">
                    <button
                      type="button"
                      className="btn btn-block btn-facebook auth-form-btn"
                    >
                      <i className="ti-facebook me-2" />
                      Connect using facebook
                    </button>
                  </div>
                  <div className="text-center mt-4 fw-light">
                    Don't have an account?{" "}
                    <a href="signup" className="text-primary">
                      Create
                    </a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* content-wrapper ends */}
      </div>
      {/* page-body-wrapper ends */}
    </div>
  );
}

export default Login;
