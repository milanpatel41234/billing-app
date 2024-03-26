import { useState, useEffect } from "react";
import Footer from "../helper/Footer";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Select } from "antd";
import { state } from "../assets/StateList";
import { countryList } from "../assets/countryList";
import { companyApi } from "../assets/apis";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { FinancialYearActions } from "../redux-store/Index";
import CreatableSelect from "react-select/creatable";

const FinancialYearArray = [
  { label: "FY 2015-2016", value: "15" },
  { label: "FY 2016-2017", value: "16" },
  { label: "FY 2017-2018", value: "17" },
  { label: "FY 2018-2019", value: "18" },
  { label: "FY 2019-2020", value: "19" },
  { label: "FY 2020-2021", value: "20" },
  { label: "FY 2021-2022", value: "21" },
  { label: "FY 2022-2023", value: "22" },
  { label: "FY 2023-2024", value: "23" },
  { label: "FY 2024-2025", value: "24" },
  { label: "FY 2025-2026", value: "25" },
  { label: "FY 2026-2027", value: "26" },
  { label: "FY 2027-2028", value: "27" },
  { label: "FY 2028-2029", value: "28" },
  { label: "FY 2029-2030", value: "29" },
  { label: "FY 2030-2031", value: "30" },
  { label: "FY 2031-2032", value: "31" },
  { label: "FY 2032-2033", value: "32" },
  { label: "FY 2033-2034", value: "33" },
  { label: "FY 2034-2035", value: "34" },
  { label: "FY 2035-2036", value: "35" },
];

function ManageCompany() {
  const navigate = useNavigate();
  const [company, setCompany] = useState({});
  const [dropdown, setDropdown] = useState({});
  const [file, setFile] = useState({});
  const [check, setCheck] = useState({});
  const [logo, setLogo] = useState({ show: null, send: null });
  const [sign, setSign] = useState({ show: null, send: null });
  const [commonSeal, setCommonSeal] = useState({ show: null, send: null });
  const Auth = useSelector((state) => state.Auth);
  const dispatch = useDispatch();
  const FYState = useSelector((state) => state.FinancialYear);
  const [companyDataAvailable, setCompanyDataAvailable] = useState(false);

  useEffect(() => {
    (async () => {
      const loading = toast.loading('Fetching details, kindly wait...')
      try {
        const response = await axios.get(companyApi, {
          headers: {
            "Content-Type": "application/json",
            token: Auth.token,
          },
        });
        const data = response.data;
        if (response.data.success) {
          setCompany({
            address: data.address,
            city: data.city,
            email: data.email,
            gst: data.gst,
            name: data.name,
            pan: data.pan,
            phone: data.phone,
            pin: data.pin,
            service_tax: data.service_tax,
            tin: data.tin,
            website: data.website,
            upi: data.upi,
            e_commerce_gst: data.e_commerce_gst,
          });
          setLogo({ show: data.logo, send: null });
          setSign({ show: data.sign, send: null });
          setCommonSeal({ show: data.common_seal, send: null });
          setDropdown({
            country: data.country,
            state: data.state,
          });
          setCheck({
            is_bank_detail: data.is_bank_detail,
            is_common_seal: data.is_common_seal,
            is_logo: data.is_logo,
            is_sign: data.is_sign,
          });
          setCompanyDataAvailable(true);
          return;
        }
        
        if (response.data.success) {
          toast.success(response.data.message);
        } else {
          toast.error("No Details added yet , Please add company...");
        }
      } catch (error) {
        // console.log(error);
        toast.error(error.response?.data?.message || "An error occurred");
      } finally{
        toast.dismiss(loading)
      }
     
    })();
  }, []);

  const manageSubmit = async () => {
    const requiredFields = [
      "name",
      "email",
      "phone",
      "address",
      "country",
      "state",
      "city",
      "pin",
    ];
    const missingFields = requiredFields.filter(
      (field) => !company[field] && !dropdown[field]
    );

    if (missingFields.length > 0) {
      // Display an alert or handle the missing fields in your preferred way
      toast.error(
        `Please fill in the required fields: ${missingFields.join(", ")}`
      );
      return;
    }
    const loading = toast.loading('Saving Details, kindly wait...')
    const formData = new FormData();

    logo.send && formData.append("logo", logo.send);
    commonSeal.send && formData.append("common_seal", commonSeal.send);
    sign.send && formData.append("sign", sign.send);
    // If companyDetails is an object, stringify it
    formData.append(
      "companyDetails",
      JSON.stringify({
        ...company,
        ...dropdown,
        ...check,
      })
    );

    if (companyDataAvailable) {
      try {
        const response = await axios.put(companyApi, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            token: Auth.token,
          },
        });
        if (response.data.success) {
          toast.success(response.data.message);
          navigate("/");
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message);
      }
    } else {
      try {
        const response = await axios.post(companyApi, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            token: Auth.token,
          },
        });
        if (response.data.success) {
          toast.success(response.data.message);
          navigate("/");
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message);
      }
    }
    toast.dismiss(loading)
  };

  const handleChange = (props, filename) => {
    if (filename) {
      setFile({ ...file, [filename]: props });
      setCompany({ ...company, [filename]: props });
    } else {
      setCompany({ ...company, [props.target.name]: props.target.value });
    }
  };
  const handleImageChange = (file, arg2) => {
    if (file) {
      // Read the selected image as a data URL
      const reader = new FileReader();
      reader.onloadend = () => {
        if (arg2 === "logo") {
          setLogo({ show: reader.result, send: file });
        } else if (arg2 === "sign") {
          setSign({ show: reader.result, send: file });
        } else if (arg2 === "seal") {
          setCommonSeal({ show: reader.result, send: file });
        }
      };
      reader.readAsDataURL(file);
    } else {
      // If no file is selected, clear the selected image
    }
  };

  const handleChangeCheckBox = (isChecked, name) => {
    setCheck({ ...check, [name]: isChecked });
  };

  const handleDropdown = (value, name) => {
    if (value?.length > 1) {
      const newVal = value.length - 1;
      setDropdown({ ...dropdown, [name]: value[newVal] });
    } else {
      setDropdown({ ...dropdown, [name]: value[0] });
    }
  };

  return (
    <div className="main-panel">
      <div className="content-wrapper">
        <div className="row">
          <div className="col-sm-12">
            <div className="d-flex justify-content-between m-1 p-1 align-items-baseline ">
              <h3 className="ukhd mb-3">
                {companyDataAvailable ? "Edit Company" : "Add Company"}
              </h3>
            </div>
            <div className="row flex-grow">
              <div className="col-12 grid-margin stretch-card">
                <div className="card card-rounded">
                  <div className="card-body">
                    <form
                      className="forms-sample"
                      onKeyPress={(event) =>
                        event.key === "Enter" ? manageSubmit() : ""
                      }
                    >
                      <div className="row">
                        <div className="col-4">
                          <div className="form-group">
                            <label> Company Name *</label>
                            <input
                              type="text"
                              className="form-control h-100"
                              placeholder="Company Name"
                              name="name"
                              value={company.name}
                              onChange={(e) => handleChange(e)}
                            />
                          </div>
                        </div>
                        <div className="col-4">
                          <div className="form-group">
                            <label> Email Address *</label>
                            <input
                              type="text"
                              className="form-control h-100"
                              placeholder="Email Address"
                              name="email"
                              value={company.email}
                              onChange={(e) => handleChange(e)}
                            />
                          </div>
                        </div>
                        <div className="col-4">
                          <div className="form-group">
                            <label>Website </label>
                            <input
                              type="text"
                              className="form-control h-100"
                              placeholder="Website"
                              readOnly=""
                              defaultValue=""
                              name="website"
                              value={company.website}
                              onChange={(e) => handleChange(e)}
                            />
                          </div>
                        </div>
                        <div className="col-4">
                          <div className="form-group">
                            <label>Phone *</label>
                            <div className="input-group mb-3">
                              <div className="input-group-append">
                                <span className="input-group-text mdi mdi-phone h-100"></span>
                              </div>
                              <input
                                type="number"
                                className="form-control h-100"
                                placeholder="Phone"
                                name="phone"
                                value={company.phone}
                                onChange={(e) => handleChange(e)}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-8">
                          <div className="form-group">
                            <label> Address *</label>
                            <textarea
                              type="text"
                              className="form-control"
                              style={{ height: "47px" }}
                              placeholder="Address"
                              name="address"
                              value={company.address}
                              onChange={(e) => handleChange(e)}
                            />
                          </div>
                        </div>
                        <div className="col-4">
                          <div className="select-container ">
                            <label className="col-12 margin-bottom-dropdown mb-2">
                              {" "}
                              Country *
                            </label>
                            <Select
                              mode="multiple"
                              style={{ height: "47px" }}
                              className="form-dropdown col-12"
                              placeholder="Select Country"
                              onChange={(value) => {
                                handleDropdown(value, "country");
                              }}
                              value={dropdown.country}
                            >
                              {countryList.map((item) => (
                                <Select.Option key={item} value={item}>
                                  {item}
                                </Select.Option>
                              ))}
                            </Select>
                          </div>
                        </div>
                        <div className="col-4">
                          <div className="select-container ">
                            <label className="col-12 margin-bottom-dropdown mb-2">
                              {" "}
                              State *
                            </label>
                            <Select
                              mode="multiple"
                              style={{ height: "49px" }}
                              className="form-dropdown col-12"
                              placeholder="Select State"
                              onChange={(value) => {
                                handleDropdown(value, "state");
                              }}
                              value={dropdown.state}
                            >
                              {state.map((item) => (
                                <Select.Option key={item} value={item}>
                                  {item}
                                </Select.Option>
                              ))}
                            </Select>
                          </div>
                        </div>
                        <div className="col-4">
                          <div className="form-group">
                            <label> City *</label>
                            <div className="input-group">
                              <input
                                type="text"
                                className="form-control h-100"
                                placeholder="City"
                                name="city"
                                value={company.city}
                                onChange={(e) => handleChange(e)}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-4">
                          <div className="form-group">
                            <label> PIN *</label>
                            <input
                              type="text"
                              className="form-control h-100"
                              placeholder="PIN"
                              value={company.pin}
                              name="pin"
                              onChange={(e) => handleChange(e)}
                            />
                          </div>
                        </div>
                        <div className="col-4">
                          <div className="form-group">
                            <label>UPI Id</label>
                            <input
                              className="form-control h-100"
                              name="upi"
                              placeholder="Enter UPI id"
                              value={company.upi}
                              onChange={(e) => handleChange(e)}
                            />
                          </div>
                        </div>
                        <div className="col-4">
                          <div className="form-group">
                            <label> Invoice Color</label>
                            <div className="input-group">
                              <input
                                type="color"
                                className="form-control h-100 form-control-color"
                                id="exampleColorInput"
                                name="color"
                                value={company.color}
                                onChange={(e) => handleChange(e)}
                                title="Choose your color"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="form-group">
                            <label> Logo </label>
                            <input
                              type="file"
                              className="form-control h-100 "
                              name="logo"
                              onChange={(e) =>
                                handleImageChange(e.target.files[0], "logo")
                              }
                            />
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="form-group">
                            <label>Sign</label>
                            <input
                              type="file"
                              className="form-control h-100"
                              name="sign"
                              onChange={(e) =>
                                handleImageChange(e.target.files[0], "sign")
                              }
                            />
                          </div>
                        </div>
                        <div className="col-6 mb-2">
                          <div className="form-group">
                            <img
                              src={
                                logo.show ||
                                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSZ-5lG7qKzu6-JEeX-7S7Gi1pWmc3IWbZuA&usqp=CAU"
                              }
                              style={{ width: "180px", height: "130px" }}
                              className="img-thumbnail img-fluid"
                            />
                          </div>
                          <input
                            type="checkbox"
                            className="checkbox margin-between"
                            name="is_logo"
                            checked={check.is_logo}
                            onChange={(e) =>
                              handleChangeCheckBox(e.target.checked, "is_logo")
                            }
                          />{" "}
                          <label className="mb-2">
                            Is Logo Printed on Invoice{" "}
                          </label>
                        </div>
                        <div className="col-6 mb-2">
                          <div className="form-group">
                            <img
                              src={
                                sign.show ||
                                "https://app.exfi.in/media/media/signatures/sign.png"
                              }
                              style={{ width: "140px", height: "130px" }}
                              className="img-thumbnail img-fluid"
                            />
                          </div>
                          <input
                            type="checkbox"
                            className="checkbox margin-between"
                            name="is_sign"
                            checked={check.is_sign}
                            onChange={(e) =>
                              handleChangeCheckBox(e.target.checked, "is_sign")
                            }
                          />{" "}
                          <label>Is Signature Printed on Invoice</label>
                        </div>

                        <div className="col-12  margin-vertical">
                          <div className="border"></div>
                        </div>

                        <div className="col-12  margin-vertical">
                          <div className="form-group m-0 p-0">
                            <label>Company Information</label>
                          </div>
                        </div>

                        <div className="col-6">
                          <div className="form-group">
                            <label> GSTIN *</label>
                            <input
                              type="text"
                              className="form-control h-100"
                              placeholder="GSTIN"
                              name="gst"
                              value={company.gst}
                              onChange={(e) => handleChange(e)}
                            />
                          </div>
                        </div>

                        <div className="col-6">
                          <div className="form-group">
                            <label>PAN *</label>
                            <div className="input-group mb-3">
                              <input
                                type="text"
                                className="form-control h-100"
                                placeholder="PAN"
                                name="pan"
                                value={company.pan}
                                onChange={(e) => handleChange(e)}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="col-4">
                          <div className="form-group">
                            <label>Common Seal</label>
                            <input
                              type="file"
                              className="form-control h-100"
                              name="common_seal"
                              placeholder="Common Seal"
                              onChange={(e) =>
                                handleImageChange(e.target.files[0], "seal")
                              }
                            />
                          </div>
                        </div>
                        <div className="col-4">
                          <div className="form-group">
                            <img
                              src={
                                commonSeal.show ||
                                "https://app.exfi.in/media/media/signatures/seal.png"
                              }
                              style={{ width: "80%" }}
                              alt="No Image Available"
                            />
                          </div>
                        </div>

                        <div className="col-4">
                          <div className="form-group mt-4">
                            <input
                              type="checkbox"
                              className="checkbox margin-between"
                              name="is_common_seal"
                              checked={check.is_common_seal}
                              onChange={(e) =>
                                handleChangeCheckBox(
                                  e.target.checked,
                                  "is_common_seal"
                                )
                              }
                            />{" "}
                            <label>Is Common Seal Printed on Invoice</label>
                          </div>
                        </div>

                        <div className="col-12  margin-vertical">
                          <div className="border"></div>
                        </div>
                      </div>
                    </form>
                    <button
                      type="submit"
                      className="btn btn-warning me-2"
                      onClick={manageSubmit}
                    >
                      {companyDataAvailable ? "Update" : "Submit"}
                    </button>
                    <button
                      className="btn btn btn-secondary"
                      onClick={() => navigate("/")}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ManageCompany;
