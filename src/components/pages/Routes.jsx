import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./Login";
import SignUp from "./SignUp";
import Dashboard from "./Dashboard";
import Header from "../helper/Header";
import Sidebar from "../helper/Sidebar";
import { useSelector } from "react-redux";
import UserProfile from "./UserProfile";
import Support from "./Support";
import Brand from "./Brand";
import ManageCompany from "./ManageCompany";
import Category from "./Category";
import ProductServices from "./Product-Services";
import Tax from "./ManageTax";
import Leads from "./Leads";
import Contacts from "./Contacts";
import Invoices from "./invoice-section/Invoices";
import Manage_seles_Inv from "./invoice-section/Manage_seles_Inv";
import Quotation from "./invoice-section/Quotation";
import Delivery_challan from "./invoice-section/Delivery_challan";
import Bill_of_supply from "./invoice-section/Bill_of_supply";
import Bank from "./Bank";
import PurchaseInvoices from "./invoice-section/Purchase_invoice";
import ManagePurchaseInv from "./invoice-section/Manage_purchase_inv";
import ManageQuotation from "./invoice-section/Manage_quotation";
import DebitCreditNotes from "./invoice-section/Notes";
import ManageNotes from "./invoice-section/Manage_Notes";
import Payments from "./invoice-section/Payments";
import Summary from "./reports/Summary"

function AllRoutes() {
  const [rightSidebarActive, setRightSidebarActive] = useState(false);
  const [leftSidebarActive, setLeftSidebarActive] = useState(true);
  const Auth = useSelector((state) => state.Auth);

  const toggleRightSidebar = () => {
    setRightSidebarActive((prevrightSidebarActive) => !prevrightSidebarActive);
  };
  const toggleLeftSidebar = () => {
    setLeftSidebarActive((prevleftSidebarActive) => !prevleftSidebarActive);
  };

  return (
    <Router>
      <div
        className={`container-scroller ${
          !leftSidebarActive && "sidebar-icon-only"
        }`}
      >
        {Auth.loginState && (
          <Header
            toggleRightSidebar={toggleRightSidebar}
            toggleLeftSidebar={toggleLeftSidebar}
          />
        )}
        <div
          className={`container-fluid page-body-wrapper ${
            Auth.loginState ? "" : "full-page-wrapper"
          } `}
        >
          {Auth.loginState && (
            <Sidebar rightSidebarActive={rightSidebarActive} />
          )}

          <Routes>
            <Route
              path="/login"
              element={!Auth.loginState ? <Login /> : <Navigate to="/" />}
            />
            <Route
              path="/signup"
              element={
                !Auth.loginState ? (
                  <SignUp />
                ) : (
                  <Navigate to="/manage_company" />
                )
              }
            />
            <Route
              path="/"
              element={
                Auth.loginState ? <Dashboard /> : <Navigate to="/login" />
              }
            />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/support" element={<Support />} />
            <Route path="/manage_company" element={<ManageCompany />} />
            <Route path="/categories" element={<Category />} />
            <Route path="/brand" element={<Brand />} />
            <Route path="/product" element={<ProductServices />} />
            <Route path="/taxes" element={<Tax />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/bank" element={<Bank />} />
            <Route path="/sales_invoice" element={<Invoices />} />
            <Route path="/purchase_invoice" element={<PurchaseInvoices />} />
            <Route path="/quotation" element={<Quotation />} />
            <Route path="/notes" element={<DebitCreditNotes />} />
            <Route path="/delivery_challan" element={<Delivery_challan />} />
            <Route path="/payment_records" element={<Payments/>} />
            <Route path="/summary" element={<Summary/>} />
            <Route
              path="/manage_sales_invoice"
              element={<Manage_seles_Inv />}
            />
            <Route
              path="/manage_purchase_invoice"
              element={<ManagePurchaseInv />}
            />
            <Route path="/manage_quotation" element={<ManageQuotation />} />
            <Route path="/manage_debit_credit_note" element={<ManageNotes />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default AllRoutes;
