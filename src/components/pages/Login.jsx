import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AuthAction } from "../redux-store";
import axios from "axios";
import { loginApi } from "../assets/apis";
import { toast } from "react-hot-toast";


function Login() {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({ ...data, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    const loading = toast.loading('verifying user kindly wait...')
    e.preventDefault();
    if (!data.email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    } else if (data.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    try {
      const response = await axios.post(
        loginApi,
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const result = response.data;
      if (result.success) {
        dispatch(AuthAction.setUserVerified({ token: result.token }));
        toast.success(result.message);
        navigate("/");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(error);
    }
    toast.dismiss(loading)
  };

  return (
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
                  onClick={handleSubmit}
                >
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
                <Link to="/" className="auth-link text-black">
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
                <Link to="/signup" className="text-primary">
                  Create
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
