import React from "react";
// import supportIcon from "../assets/icons/help-call_4874360.png";

function Support() {
  return (
        <div className='main-panel'>
          <div className="content-wrapper  ">
            <div className="row">
              <div className="col-sm-12">
                <div className="row flex-grow">
                  <div className="row">
                    <div className="col-12">
                      <div className="col-12 grid-margin stretch-card">
                        <div className="card card-rounded">
                          <div className="card-body">
                            <img
                              src={'#'}
                              style={{ borderRadius: "20%", width: "10rem" }}
                              alt=""
                            />
                            <h2>Support</h2>
                            <hr />
                            <h6>
                              <marquee>
                                Need help with your purchease, part payment
                                account or anything we're available on the
                                chat 24/7.
                              </marquee>
                            </h6>
                            <hr />
                            <h2>Conversations</h2>
                            <br />

                            <button
                              type="button"
                              className="btn btn-dark me-2"
                              style={{ borderRadius: "50px" }}
                            >
                              <i class="bi bi-envelope"></i> support@gmail.com
                            </button>
                            <br />
                            <br />

                            <button
                              type="button"
                              className="btn btn-dark me-2"
                              style={{ borderRadius: "50px" }}
                            >
                              <i class="bi bi-telephone"></i> +91 1234567890
                            </button>
                            <br />
                            <br />

                            <button
                              type="button"
                              className="btn btn-dark me-2"
                              style={{ borderRadius: "50px" }}
                            >
                              <i class="bi bi-geo-alt"></i> No. 305, Block no.
                              E-11/8, Prateek Center, Sanjay Palace, Sanjay
                              Place, Civil Lines, Agra, Uttar Pradesh 282002
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
        </div>
  );
}

export default Support;
