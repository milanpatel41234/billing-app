import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { userProfile } from "../assets/apis";
import toast from "react-hot-toast";
import Footer from "../helper/Footer";
import { useSelector } from "react-redux";

const UserProfile = () => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userCPassword, setUserCPassword] = useState("");
  const Auth = useSelector((state) => state.Auth);

  const fecthApiData = async () => {
    try {
      const response = await axios.get(userProfile, {
        headers: { "Content-Type": "application/json", token: Auth.token },
      });
      if (response.status === 200) {
        setUserName(response.data.name);
        setUserEmail(response.data.email);
        setUserPhone(response.data.mobile);
      }
    } catch (error) {
        toast.error("sorry! sever error");
    }
  };
  useEffect(() => {
    fecthApiData();
  }, []);

  const onSubmitProfileUpdate = async () => {
    try {
      const response = await axios.put(
        `${userProfile}/profileupdate`,
        {
          email: userEmail,
          name: userName,
          mobile: userPhone,
        },
        {
          headers: {
            "Content-Type": "application/json",
            token: Auth.token,
          },
        }
      );

      if (response.status === 200) {
        console.log(response.data.message);
        toast.success(response.data.message);
      } else {
        toast.error("sorry! sever error");
      }
    } catch (error) {
      toast.error("sorry! sever error");
    }
  };

  const onSubmitPasswordUpdate = async () => {
   
    if( userPassword.length < 8){
        toast.error('Password must be at least 8 characters');
        return
      } else if( userPassword !== userCPassword){
        toast.error('Password and Confirm Password must be same');
        return
      }

      try {
        const response = await axios.put(
            `${userProfile}/passwordupdate`,
            {
              password: userPassword,
            },
            {
              headers: {
                "Content-Type": "application/json",
                token: Auth.token,
              },
            }
          );

        if (response.status === 200) {
          console.log(response.data.message);
          toast.success(response.data.message);
        } else {
            toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    
  };

 
  return (
    <>
      <div className="main-panel">
        <div className="content-wrapper">
          <div className="row">
            <div className="col-sm-12">
              <div className="row flex-grow">
                <h2 className="ukhd mb-3">My Profile</h2>

                

                <div className="row">
                  <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                    <div className="col-12 grid-margin stretch-card">
                      <div className="card card-rounded">
                        <div className="card-body">
                          <img
                            src="https://www.w3schools.com/howto/img_avatar.png"
                            style={{ borderRadius: "50%", width: "10rem" }}
                            alt=""
                          />
                          <h3 style={{ marginTop: "10px" }}>{userEmail}</h3>
                          <hr />
                          <form
                            onSubmit={onSubmitProfileUpdate}
                            className="row"
                          >
                            <div className="col-5">
                              <div className="form-group">
                                <div className="select-container ">
                                  <label className="col-12"> *Name</label>
                                  <div className="input-group">
                                    <input
                                      type="text"
                                      className="form-control form-control-alternative"
                                      placeholder="name"
                                      name="name"
                                      value={userName}
                                      onChange={(e) => {
                                        setUserName(e.target.value);
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="col-5">
                              <div className="form-group">
                                <div className="select-container ">
                                  <label className="col-12"> *Email</label>
                                  <div className="input-group">
                                    <input
                                      type="text"
                                      className="form-control form-control-alternative"
                                      placeholder="username"
                                      name="username"
                                      value={userEmail}
                                      readOnly={true}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="col-5">
                              <div className="form-group">
                                <div className="select-container ">
                                  <label className="col-12"> *Phone No</label>
                                  <div className="input-group">
                                    <input
                                      type="text"
                                      className="form-control form-control-alternative"
                                      placeholder="Phone"
                                      name="Phone"
                                      value={userPhone}
                                      onChange={(e) => {
                                        setUserPhone(e.target.value);
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </form>

                          <button
                            type="button"
                            className="btn btn-warning me-2"
                            onClick={onSubmitProfileUpdate}
                          >
                            Update
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-4 col-md-4 col-sm-12 col-12">
                    <div className="col-12 grid-margin stretch-card">
                      <div className="card card-rounded">
                        <div className="card-body">
                          <h4>Update Password</h4>
                          <hr />

                          <form className="row">
                            <div className="col-10">
                              <div className="form-group">
                                <div className="select-container ">
                                  <label className="col-12"> *Password</label>
                                  <div className="input-group">
                                    <input
                                      type="password"
                                      className="form-control form-control-alternative"
                                      placeholder="Password"
                                      name="password"
                                      value={userPassword}
                                      onChange={(e) => {
                                        setUserPassword(e.target.value);
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="col-10">
                              <div className="form-group">
                                <div className="select-container ">
                                  <label className="col-12">
                                    {" "}
                                    *Confirm Password
                                  </label>
                                  <div className="input-group">
                                    <input
                                      type="password"
                                      className="form-control form-control-alternative"
                                      placeholder="Confirm assword"
                                      name="cpassword"
                                      value={userCPassword}
                                      onChange={(e) => {
                                        setUserCPassword(e.target.value);
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </form>
                          <hr />

                          <button
                            type="button"
                            className="btn btn-success me-2"
                            onClick={onSubmitPasswordUpdate}
                          >
                            Update Password
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};
export default UserProfile;
