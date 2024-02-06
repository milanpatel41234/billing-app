import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { AuthAction } from "../redux-store/Index";

function Sidebar({ rightSidebarActive }) {
  const dispatch = useDispatch();
  const [openContactModal, setOpenContactModal] = useState(false);
  const [openItemsModal, setOpenItemsModal] = useState(false);
  const [openTaxModal, setOpenTaxModal] = useState(false);
  const [openInvoiceModal, setOpenInvoiceModal] = useState(false);

  return (
    <>
      <div>
        <div className="theme-setting-wrapper">
          <div id="settings-trigger">
            <i className="ti-settings" />
          </div>
          <div id="theme-settings" className="settings-panel">
            <i className="settings-close ti-close" />
            <p className="settings-heading">SIDEBAR SKINS</p>
            <div
              className="sidebar-bg-options selected"
              id="sidebar-light-theme"
            >
              <div className="img-ss rounded-circle bg-light border me-3" />
              Light
            </div>
            <div className="sidebar-bg-options" id="sidebar-dark-theme">
              <div className="img-ss rounded-circle bg-dark border me-3" />
              Dark
            </div>
            <p className="settings-heading mt-2">HEADER SKINS</p>
            <div className="color-tiles mx-0 px-4">
              <div className="tiles success" />
              <div className="tiles warning" />
              <div className="tiles danger" />
              <div className="tiles info" />
              <div className="tiles dark" />
              <div className="tiles default" />
            </div>
          </div>
        </div>
        <div id="right-sidebar" className="settings-panel">
          <i className="settings-close ti-close" />
          <ul
            className="nav nav-tabs border-top"
            id="setting-panel"
            role="tablist"
          >
            <li className="nav-item">
              <a
                className="nav-link active"
                id="todo-tab"
                data-bs-toggle="tab"
                href="#todo-section"
                role="tab"
                aria-controls="todo-section"
                aria-expanded="true"
              >
                TO DO LIST
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                id="chats-tab"
                data-bs-toggle="tab"
                href="#chats-section"
                role="tab"
                aria-controls="chats-section"
              >
                CHATS
              </a>
            </li>
          </ul>
          <div className="tab-content" id="setting-content">
            <div
              className="tab-pane fade show active scroll-wrapper"
              id="todo-section"
              role="tabpanel"
              aria-labelledby="todo-section"
            >
              <div className="add-items d-flex px-3 mb-0">
                <form className="form w-100">
                  <div className="form-group d-flex">
                    <input
                      type="text"
                      className="form-control todo-list-input"
                      placeholder="Add To-do"
                    />
                    <button
                      type="submit"
                      className="add btn btn-primary todo-list-add-btn"
                      id="add-task"
                    >
                      Add
                    </button>
                  </div>
                </form>
              </div>
              <div className="list-wrapper px-3">
                <ul className="d-flex flex-column-reverse todo-list">
                  <li>
                    <div className="form-check">
                      <label className="form-check-label">
                        <input className="checkbox" type="checkbox" />
                        Team review meeting at 3.00 PM
                      </label>
                    </div>
                    <i className="remove ti-close" />
                  </li>
                  <li>
                    <div className="form-check">
                      <label className="form-check-label">
                        <input className="checkbox" type="checkbox" />
                        Prepare for presentation
                      </label>
                    </div>
                    <i className="remove ti-close" />
                  </li>
                  <li>
                    <div className="form-check">
                      <label className="form-check-label">
                        <input className="checkbox" type="checkbox" />
                        Resolve all the low priority tickets due today
                      </label>
                    </div>
                    <i className="remove ti-close" />
                  </li>
                  <li className="completed">
                    <div className="form-check">
                      <label className="form-check-label">
                        <input
                          className="checkbox"
                          type="checkbox"
                          defaultChecked
                        />
                        Schedule meeting for next week
                      </label>
                    </div>
                    <i className="remove ti-close" />
                  </li>
                  <li className="completed">
                    <div className="form-check">
                      <label className="form-check-label">
                        <input
                          className="checkbox"
                          type="checkbox"
                          defaultChecked
                        />
                        Project review
                      </label>
                    </div>
                    <i className="remove ti-close" />
                  </li>
                </ul>
              </div>
              <h4 className="px-3 text-muted mt-5 fw-light mb-0">Events</h4>
              <div className="events pt-4 px-3">
                <div className="wrapper d-flex mb-2">
                  <i className="ti-control-record text-primary me-2" />
                  <span>Feb 11 2018</span>
                </div>
                <p className="mb-0 font-weight-thin text-gray">
                  Creating component page build a js
                </p>
                <p className="text-gray mb-0">The total number of sessions</p>
              </div>
              <div className="events pt-4 px-3">
                <div className="wrapper d-flex mb-2">
                  <i className="ti-control-record text-primary me-2" />
                  <span>Feb 7 2018</span>
                </div>
                <p className="mb-0 font-weight-thin text-gray">
                  Meeting with Alisa
                </p>
                <p className="text-gray mb-0 ">Call Sarah Graves</p>
              </div>
            </div>
            {/* To do section tab ends */}
            <div
              className="tab-pane fade"
              id="chats-section"
              role="tabpanel"
              aria-labelledby="chats-section"
            >
              <div className="d-flex align-items-center justify-content-between border-bottom">
                <p className="settings-heading border-top-0 mb-3 pl-3 pt-0 border-bottom-0 pb-0">
                  Friends
                </p>
                <small className="settings-heading border-top-0 mb-3 pt-0 border-bottom-0 pb-0 pr-3 fw-normal">
                  See All
                </small>
              </div>
              <ul className="chat-list">
                <li className="list active">
                  <div className="profile">
                    <img src="images/faces/face1.jpg" alt="image" />
                    <span className="online" />
                  </div>
                  <div className="info">
                    <p>Thomas Douglas</p>
                    <p>Available</p>
                  </div>
                  <small className="text-muted my-auto">19 min</small>
                </li>
                <li className="list">
                  <div className="profile">
                    <img src="images/faces/face2.jpg" alt="image" />
                    <span className="offline" />
                  </div>
                  <div className="info">
                    <div className="wrapper d-flex">
                      <p>Catherine</p>
                    </div>
                    <p>Away</p>
                  </div>
                  <div className="badge badge-success badge-pill my-auto mx-2">
                    4
                  </div>
                  <small className="text-muted my-auto">23 min</small>
                </li>
                <li className="list">
                  <div className="profile">
                    <img src="images/faces/face3.jpg" alt="image" />
                    <span className="online" />
                  </div>
                  <div className="info">
                    <p>Daniel Russell</p>
                    <p>Available</p>
                  </div>
                  <small className="text-muted my-auto">14 min</small>
                </li>
                <li className="list">
                  <div className="profile">
                    <img src="images/faces/face4.jpg" alt="image" />
                    <span className="offline" />
                  </div>
                  <div className="info">
                    <p>James Richardson</p>
                    <p>Away</p>
                  </div>
                  <small className="text-muted my-auto">2 min</small>
                </li>
                <li className="list">
                  <div className="profile">
                    <img src="images/faces/face5.jpg" alt="image" />
                    <span className="online" />
                  </div>
                  <div className="info">
                    <p>Madeline Kennedy</p>
                    <p>Available</p>
                  </div>
                  <small className="text-muted my-auto">5 min</small>
                </li>
                <li className="list">
                  <div className="profile">
                    <img src="images/faces/face6.jpg" alt="image" />
                    <span className="online" />
                  </div>
                  <div className="info">
                    <p>Sarah Graves</p>
                    <p>Available</p>
                  </div>
                  <small className="text-muted my-auto">47 min</small>
                </li>
              </ul>
            </div>
            {/* chat tab ends */}
          </div>
        </div>
        {/* partial */}
        {/* partial:partials/_sidebar.html */}
        <nav
          className={`sidebar sidebar-offcanvas ${
            rightSidebarActive && "active"
          }`}
          id="sidebar"
        >
          <ul className="nav" style={{"paddingTop": rightSidebarActive ? undefined : "100px"}}>
            <li className="nav-item">
              <Link
                className="nav-link"
                data-bs-toggle="collapse"
                to="/"
                aria-expanded="false"
                aria-controls="ui-basic"
              >
                <i className="menu-icon mdi mdi-airplay" />
                <span className="menu-title">Dashboard</span>
              </Link>
            </li>
            <li className="nav-item">
              <div
                className={`nav-link ${openContactModal && "collapsed"}`}
                data-bs-toggle="collapse"
                aria-expanded={openContactModal}
                aria-controls="form-elements"
                onClick={() =>
                  setOpenContactModal(
                    (prevopenContactModal) => !prevopenContactModal
                  )
                }
              >
                <i className="menu-icon mdi mdi-account-multiple" />
                <span className="menu-title">All Contacts</span>
                <i className="menu-arrow" />
              </div>
              <div
                className={`collapse ${openContactModal && "show"}`}
                id="form-elements"
              >
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item">
                    <Link className="nav-link" to="/contacts">
                      Contacts
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/leads">
                      Leads
                    </Link>
                  </li>
                </ul>
              </div>
            </li>
            <li className="nav-item">
              <div
                className={`nav-link ${openItemsModal && "collapsed"}`}
                data-bs-toggle="collapse"
                aria-expanded={openItemsModal}
                aria-controls="form-elements"
                onClick={() =>
                  setOpenItemsModal((prevopenItemsModal) => !prevopenItemsModal)
                }
              >
                <i className="menu-icon mdi mdi-apple-keyboard-option" />
                <span className="menu-title">Items</span>
                <i className="menu-arrow" />
              </div>
              <div
                className={`collapse ${openItemsModal && "show"}`}
                id="form-elements"
              >
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item">
                    <Link className="nav-link" to="product">
                      Product/Services
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/Categories">
                      Categories
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/brand">
                      Brand
                    </Link>
                  </li>
                </ul>
              </div>
            </li>
            <li className="nav-item">
              <div
                className={`nav-link ${openTaxModal && "collapsed"}`}
                data-bs-toggle="collapse"
                aria-expanded={openTaxModal}
                aria-controls="form-elements"
                onClick={() =>
                  setOpenTaxModal((prevopenTaxModal) => !prevopenTaxModal)
                }
              >
                <i className="menu-icon mdi mdi-airballoon" />
                <span className="menu-title">Taxes</span>
                <i className="menu-arrow" />
              </div>
              <div
                className={`collapse ${openTaxModal && "show"}`}
                id="form-elements"
              >
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item">
                    <Link className="nav-link" to="manage_tax">
                      Manage Tax
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/gst_hsn">
                      GST HSN Code
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/manage_hsn">
                      Manage HSN
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/gst_sac">
                      GST SAC Code
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/manage_sac">
                      Manage SAC
                    </Link>
                  </li>
                </ul>
              </div>
            </li>
            <li className="nav-item">
              <div
                className={`nav-link ${openInvoiceModal && "collapsed"}`}
                data-bs-toggle="collapse"
                aria-expanded={openInvoiceModal}
                aria-controls="form-elements"
                onClick={() =>
                  setOpenInvoiceModal(
                    (prevopenInvoiceModal) => !prevopenInvoiceModal
                  )
                }
              >
                <i className="menu-icon mdi mdi-card-text-outline" />
                <span className="menu-title">Invoices</span>
                <i className="menu-arrow" />
              </div>
              <div
                className={`collapse ${openInvoiceModal && "show"}`}
                id="form-elements"
              >
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item">
                    <Link className="nav-link" to="/sales_invoice">
                      Sales Invoice
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/purchase_invoice">
                      Purchase Invoice
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/quotation">
                      Quotation
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/notes">
                      Debit/Credit Note
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/bill_of_supply">
                      Bill Of Supply
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/delivery_challan">
                      Delivery Challan
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/bulk_payment">
                      Bulk Payment
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/payment_records">
                      Payment Records
                    </Link>
                  </li>
                </ul>
              </div>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link"
                data-bs-toggle="collapse"
                to="/summary"
                aria-expanded="false"
                aria-controls="ui-basic"
              >
                <i className="menu-icon mdi mdi-arrange-bring-forward" />
                <span className="menu-title">Reports</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                data-bs-toggle="collapse"
                to="/users"
                aria-expanded="false"
                aria-controls="ui-basic"
              >
                <i className="menu-icon mdi mdi-account-check" />
                <span className="menu-title">Users</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                data-bs-toggle="collapse"
                to="/support"
                aria-expanded="false"
                aria-controls="ui-basic"
              >
                <i className="menu-icon mdi mdi-alert-circle-outline" />
                <span className="menu-title">Support</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                data-bs-toggle="collapse"
                aria-expanded="false"
                aria-controls="ui-basic"
                onClick={() => dispatch(AuthAction.setlogout())}
                to="/login"
              >
                <i className="menu-icon mdi mdi-account-remove" />
                <span className="menu-title">Logout</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}

export default Sidebar;
