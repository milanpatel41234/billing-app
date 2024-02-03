import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

function SignUp() {

    const [data, setData] = useState({
        name: "",
        email: "",
        mobile: "",
        password: "",
        confirmPassword: "",
      });


    const handleChange = (e) => {
        setData({ ...data, [e.target.id]: e.target.value });
      };
    const handleSubmit= async(e)=>{
      e.preventDefault();
      if(data.name.trim().length < 1){
        toast.error('Please enter Name');
        return
      }else if(!data.email.includes('@')){
        toast.error('Please enter a valid email address');
        return
      }else if(data.mobile.length !== 10){
        toast.error('Please enter a valid Mobile number');
        return
      }else if( data.password.length < 8){
        toast.error('Password must be at least 8 characters');
        return
      } else if( data.password !== data.confirmPassword){
        toast.error('Password and Confirm Password must be same');
        return
      }
      try {
        
      } catch (error) {
        
      }
    }

  return (
    <div className="container-scroller">
      <div className="container-fluid page-body-wrapper full-page-wrapper">
        <div className="content-wrapper d-flex align-items-center auth px-0">
          <div className="row w-100 mx-0">
            <div className="col-lg-4 mx-auto">
              <div className="auth-form-light text-left py-5 px-4 px-sm-5">
                <div className="brand-logo">
                  <h3>Exfi</h3>
                </div>
                <div>
                    <div className="d-flex justify-content-between">
                      <h3>Sign Up</h3>
                      <Link
                        className="p-2 mb-2 bg-warning text-dark rounded"
                        to="/"
                        style={{ textDecoration: 'none' }}
                      >
                        SIGN IN
                      </Link>
                    </div>
                  </div>
                <form className="pt-3">
                  <div className="form-group">
                    <input
                      type="name"
                      className="form-control form-control-lg"
                      id="name"
                      placeholder="Name"
                      required={true}
                      onChange={handleChange}
                      value={data.name}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      id="email"
                      placeholder="Email"
                      required={true}
                      onChange={handleChange}
                      value={data.email}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="mobile"
                      className="form-control form-control-lg"
                      id="mobile"
                      placeholder="Mobile"
                      required={true}
                      onChange={handleChange}
                      value={data.mobile}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      id="password"
                      placeholder="Password"
                      required={true}
                      minLength='8'
                      onChange={handleChange}
                      value={data.password}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      id="confirmPassword"
                      placeholder="Confirm Password"
                      required={true}
                      onChange={handleChange}
                      value={data.confirmPassword}
                    />
                  </div>
            
                  <div className="mt-3">
                    <button
                      className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
                    onClick={handleSubmit}
                    >
                      Create Account
                    </button>
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

export default SignUp
