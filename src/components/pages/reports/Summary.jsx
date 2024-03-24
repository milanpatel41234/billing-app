import React, { useState } from "react";
import SummaryReports from "./SummaryReports";
import GSTReports from "./GSTReports";
import StockReports from "./StockReports";

const Summary = () => {
  const [activeTab, setActiveTab] = useState("summary");

  const handleTabUpdate = (tabName) => {
    setActiveTab(tabName);
  };
  return (
    <div className="main-panel  ">
      <div className="content-wrapper">
        <div className="d-flex justify-content-center m-1 ">
          <nav className="navbar  rounded rounded-2 navbar-expand-lg navbar-light w-100  row col-sm-12 col-lg-12  ">
            <div
              className="collapse navbar-collapse col-lg-12 col-sm-12   d-flex justify-content-start "
              id="navbarSupportedContent fw-bold "
            >
              <ul className=" w-100 row navbar-nav  ">
                <li
                  className="nav-item col-sm-12 col-lg-2 "
                  onClick={() => handleTabUpdate("summary")}
                  name="summary"
                >
                  <p
                    className={`nav-link btn border border-dark m-1 fw-bold ${
                      activeTab == "summary" && " btn-primary text-light "
                    } d-flex justify-content-center align-items-center`}
                    name="summary"
                  >
                    <i class="mdi mdi-view-dashboard me-1"></i>
                    Summary
                  </p>
                </li>
                <li
                  className="nav-item col-sm-12 col-lg-2"
                  onClick={() => handleTabUpdate("stockReports")}
                  name="stockReports"
                >
                  <p
                    className={` nav-link btn border border-dark m-1 fw-bold ${
                      activeTab == "stockReports" && "btn-primary text-light "
                    }  d-flex justify-content-center align-items-center`}
                    name="stockReports"
                  >
                    <i class="mdi mdi-package-variant-closed me-1"></i>
                    Stock Reports
                  </p>
                </li>

                <li
                  className="col-sm-12 col-lg-2 nav-item"
                  onClick={() => handleTabUpdate("gstReport")}
                  name="gstReport"
                >
                  <p
                    className={`nav-link btn border border-dark m-1 fw-bold ${
                      activeTab == "gstReport" && "btn-primary text-light  "
                    }  d-flex justify-content-center align-items-center`}
                    name="gstReport"
                  >
                    <i class="mdi mdi-currency-inr "></i>
                    GST Report
                  </p>
                </li>
                <li
                  className="col-sm-12 col-lg-2 nav-item"
                  onClick={() => handleTabUpdate("invoiceReport")}
                  name="invoiceReport"
                >
                  <p
                    className={`nav-link btn border border-dark m-1 fw-bold ${
                      activeTab == "invoiceReport" && "btn-primary text-light  "
                    }  d-flex justify-content-center align-items-center`}
                    name="invoiceReport"
                  >
                    <i class="mdi mdi-receipt "></i>
                    Invoice Report
                  </p>
                </li>

                <li
                  className="col-sm-12 col-lg-2 nav-item"
                  onClick={() => handleTabUpdate("SupplierReport")}
                  name="SupplierReport"
                >
                  <p
                    className={`nav-link btn border border-dark m-1 fw-bold ${
                      activeTab == "SupplierReport" &&
                      "btn-primary text-light  "
                    } d-flex justify-content-center align-items-center`}
                    name="SupplierReport"
                  >
                    <i class="mdi  mdi-account-supervisor "></i>
                    Supplier Report
                  </p>
                </li>

                <li
                  className="col-sm-12 col-lg-2 nav-item"
                  onClick={() => handleTabUpdate("InventoryReport")}
                  name="InventoryReport"
                >
                  <p
                    className={`nav-link btn border border-dark m-1 fw-bold ${
                      activeTab == "InventoryReport" &&
                      "btn-primary text-light  "
                    } d-flex justify-content-center align-items-center`}
                    name="InventoryReport"
                  >
                    <i class="mdi mdi-archive "></i>
                    Inventory Report
                  </p>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <div className="row">
          {activeTab === "summary" && <SummaryReports />}
          {activeTab === "gstReport" && <GSTReports />}
          {activeTab === "stockReports" && <StockReports />}
        </div>
      </div>
    </div>
  );
};

export default Summary;
