import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import { Box } from "@mui/system";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import CreatableSelect from "react-select/creatable";
import { contactApi } from "../assets/apis";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { countryList as rawArray } from "../assets/countryList";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  height: "80vh",
  width: "80vw",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  overflowX: "scroll",
};
const countryList = rawArray.map((name) => ({ label: name, value: name }));

const Contacts = () => {
  const [addContactVisible, setAddContactVisible] = useState(false);
  const [customerData, setCustomerData] = useState({});
  const [allContacts, setAllContacts] = useState([]);
  const [editContactState, setEditContactState] = useState(null);
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [contactType, setContactType] = useState("customer");
  const [totalPages, setTotalPages] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
  });

  // const filteredData = allContacts?.filter((item) =>
  //   Object.values(item).some((val) =>
  //     val?.toString().toLowerCase().includes(searchTerm?.toLowerCase())
  //   )
  // );

  const updateCustomerData = (e, select_name) => {
    if (select_name) {
      return setCustomerData((prev) => {
        return {
          ...prev,
          [select_name]: e,
        };
      });
    } else if (e.target?.type !== "checkbox") {
      const name = e.target.name;
      const value = e.target.value;

      return setCustomerData((prev) => {
        return {
          ...prev,
          [name]: value,
        };
      });
    } else {
      return setCustomerData((prev) => {
        return {
          ...prev,
          shipping_address: "",
          shipping_city: "",
          shipping_name: "",
          shipping_display_name: "",
          shipping_country: "",
          shipping_email: "",
          shipping_pin_code: "",
          shipping_phone: "",
          shipping_state: "",
          isBillAndShipAddressSame: e.target.checked,
        };
      });
    }
  };

  const saveContact = async () => {
    try {
      const contact = {
        ...customerData,
        contactType,
        billing_country: customerData.billing_country?.value,
        shipping_country: customerData.shipping_country?.value,
      };
      const response = await axios.post(contactApi, contact);

      toast.success("Contact added successfully");
      resetFormAndHideModal();
      refetch();
    } catch (error) {
      handleApiError(error);
    }
  };

  const editContact = async () => {
    try {
      const data = {
        ...customerData,
        contactType,
        billing_country: customerData.billing_country?.value,
        shipping_country: customerData.shipping_country?.value,
      };
      const response = await axios.put(
        `${contactApi}/${editContactState}`,
        data
      );

      toast.success("Contact edited successfully");
      resetFormAndHideModal();
      queryClient.invalidateQueries("contacts");
      setEditContactState(null);
      refetch();
    } catch (error) {
      handleApiError(error);
    }
  };

  const deleteContact = async (id) => {
    try {
      const response = await axios.delete(`${contactApi}/${id}`);

      toast.success("Contact deleted successfully");
      refetch();
    } catch (error) {
      handleApiError(error);
    }
  };

  const resetFormAndHideModal = () => {
    setAddContactVisible(false);
    setCustomerData({});
  };

  const handleApiError = (error) => {
    const errorMessage = error.response?.data?.message || "An error occurred";
    // toast.error(errorMessage);
  };

  const fetchContacts = async () => {
    try {
      const response = await axios.get(
        `${contactApi}?page=${Number(pagination.currentPage)}&pageSize=${Number(
          pagination.pageSize
        )}&search=${searchTerm}`
      );
      setAllContacts(response.data.contacts);
      setTotalPages(response.data.totalPages);
      return response.data;
    } catch (error) {
      console.error(error);
      // Handle the error, perhaps set an error state or throw it further
      handleApiError(error);
    }
  };

  const { isLoading, isError, data, error, refetch } = useQuery({
    queryKey: ["contacts"],
    queryFn: fetchContacts,
    enabled: false,
  });

  useEffect(() => {
    refetch();
  }, [pagination]);
  useEffect(() => {
    const timer = setTimeout(refetch, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <div className="main-panel  ">
      <div className="content-wrapper">
        <div id="first" className="card col-lg-12 p-3">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div className="card-title"> All Contacts</div>
            <button
              className="btn btn-primary d-flex justify-content-center"
              onClick={() => setAddContactVisible(true)}
            >
              <i className="mdi  mdi-account-plus me-1"></i>
              Add Contact
            </button>
          </div>

          <div className="p-mb-4 mb-3 d-flex justify-content-between align-items-end w-100">
            <span className="p-input-icon-left">
              <InputText
                className="rounded rounded-4"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </span>
          </div>
          <div className="d-flex flex-column  align-items-center datatable">
            <DataTable
              value={allContacts}
              style={{ width: "100%" }}
              id="review-table"
              className="mytable"
            >
              <Column
                className="border-bottom border-top "
                header="SR. No."
                body={(rowData, { rowIndex }) =>
                  pagination.currentPage * pagination.pageSize -
                  pagination.pageSize +
                  rowIndex +
                  1
                }
                style={{
                  height: "3rem",
                  alignItems: "center",
                  textAlign: "center",
                  minWidth: "3rem",
                }}
              />

              <Column
                className="border-bottom border-top"
                field="name"
                header="NAME"
                sortable
                style={{
                  height: "3rem",
                  alignItems: "center",
                  textAlign: "center",
                  minWidth: "7rem",
                  padding: "0 5px",
                }}
              />
              <Column
                className="border-bottom border-top"
                field="display_name"
                header="DISPLAY NAME"
                sortable
                style={{
                  height: "3rem",
                  alignItems: "center",
                  textAlign: "center",
                  minWidth: "9rem",
                  padding: "0 5px",
                }}
              />
              <Column
                className="border-bottom border-top"
                field="email"
                header="EMAIL"
                sortable
                style={{
                  height: "3rem",
                  alignItems: "center",
                  textAlign: "center",
                  minWidth: "7rem",
                  padding: "0 5px",
                }}
              />
              <Column
                className="border-bottom border-top"
                field="phone"
                header="PHONE"
                style={{
                  height: "3rem",
                  alignItems: "center",
                  textAlign: "center",
                  minWidth: "5rem",
                  padding: "0 5px",
                }}
              />
              <Column
                className="border-bottom border-top"
                field="contactType"
                header="TYPE"
                style={{
                  height: "3rem",
                  alignItems: "center",
                  textAlign: "center",
                  minWidth: "5rem",
                  padding: "0 5px",
                }}
              />

              <Column
                className="border-bottom border-top"
                body={(data) => (
                  <div
                    style={{
                      minWidth: "50%",
                      maxWidth: "2rem",
                      display: "flex",
                      justifyContent: "space-around",
                      alignItems: "center",
                      paddingLeft: "3rem",
                    }}
                  >
                    <i
                      style={{ cursor: "pointer" }}
                      onClick={(e) => {
                        setEditContactState(data.id);

                        setCustomerData({
                          ...data,
                          billing_country: {
                            value: data.billing_country,
                            label: data.billing_country,
                          },
                          shipping_country: {
                            value: data.shipping_country,
                            label: data.shipping_country,
                          },
                        });
                        setContactType(data.contactType);
                        setAddContactVisible(true);
                      }}
                      className="dropdown-item-icon mdi mdi-pen text-primary me-2"
                    />
                    <i
                      style={{ cursor: "pointer" }}
                      onClick={(e) => {
                        deleteContact(data.id);
                      }}
                      className="dropdown-item-icon mdi mdi-delete-forever text-primary me-2"
                    />
                  </div>
                )}
                header="ACTIONS"
              />
            </DataTable>
            <div
              className=""
              style={{
                display: "flex",
                width: "80%",
                justifyContent: "space-evenly",
                margin: "10px 0 0 0",
              }}
            >
              <button
                style={{ border: "none", fontSize: "24px" }}
                disabled={pagination.currentPage === 1}
                onClick={() =>
                  setPagination((prev) => {
                    return { ...prev, currentPage: prev.currentPage - 1 };
                  })
                }
              >
                <i className="mdi mdi-chevron-left" />
              </button>
              <span>
                Page {pagination.currentPage} of {totalPages}
              </span>
              <button
                style={{ border: "none", fontSize: "24px" }}
                disabled={pagination.currentPage === totalPages}
                onClick={() =>
                  setPagination((prev) => {
                    return { ...prev, currentPage: prev.currentPage + 1 };
                  })
                }
              >
                <i className="mdi mdi-chevron-right" />
              </button>
              <select
                value={pagination.pageSize}
                onChange={(e) =>
                  setPagination((prev) => {
                    return { ...prev, pageSize: e.target.value };
                  })
                }
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
                <option value="25">25</option>
                <option value="30">30</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* modal for add contact  */}

      <Modal
        open={addContactVisible}
        onClose={() => {
          setAddContactVisible(false);
          setCustomerData({});
          setEditContactState(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <>
          <Box
            sx={style}
            className="row card d-flex flex-row rounded rounded-2"
          >
            <div className="col-12 ps-5">
              <div className="row">
                <div className="form-check col-lg-3 col-md-3 col-sm-6">
                  <input
                    checked={contactType === "customer"}
                    onChange={() => {
                      contactType === "customer"
                        ? setContactType("supplier")
                        : setContactType("customer");
                      setCustomerData((prev) => ({
                        ...prev,
                        isBillAndShipAddressSame: "",
                        shipping_name: "",
                        shipping_display_name: "",
                        shipping_phone: "",
                        shipping_address: "",
                        shipping_country: "",
                        shipping_state: "",
                        shipping_city: "",
                        shipping_PIN_Code: "",
                      }));
                    }}
                    type="radio"
                    className="form-check-input"
                    id="option1"
                    name="options"
                    value="option1"
                  />
                  <label className="form-check-label" htmlFor="option1">
                    Customer
                  </label>
                </div>

                <div className="form-group col-lg-3 col-md-3 col-sm-6">
                  <div className="form-check">
                    <input
                      checked={contactType === "supplier"}
                      onChange={() => {
                        contactType === "customer"
                          ? setContactType("supplier")
                          : setContactType("customer");
                        setCustomerData((prev) => ({
                          ...prev,
                          isBillAndShipAddressSame: "",
                          shipping_name: "",
                          shipping_display_name: "",
                          shipping_phone: "",
                          shipping_address: "",
                          shipping_country: "",
                          shipping_state: "",
                          shipping_city: "",
                          shipping_PIN_Code: "",
                        }));
                      }}
                      type="radio"
                      className="form-check-input"
                      id="option2"
                      name="options"
                      value="option2"
                    />
                    <label className="form-check-label" htmlFor="option2">
                      Supplier
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 ">
              <h5>CONTACT INFORMATION</h5>
            </div>
            <div className="row">
              <div className="col-md-3">
                <div className="form-group">
                  <label>Customer Name *</label>
                  <input
                    required
                    value={customerData.name}
                    onChange={updateCustomerData}
                    name="name"
                    type="text"
                    className="form-control"
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <label>Display Name *</label>
                  <input
                    required
                    value={customerData.display_name}
                    onChange={updateCustomerData}
                    name="display_name"
                    type="text"
                    className="form-control"
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <label>Phone *</label>
                  <input
                    required
                    value={customerData.phone}
                    onChange={updateCustomerData}
                    name="phone"
                    type="text"
                    className="form-control"
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    required
                    value={customerData.email}
                    onChange={updateCustomerData}
                    name="email"
                    type="text"
                    className="form-control"
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <label>GSTIN</label>
                  <input
                    required
                    value={customerData.GSTIN}
                    onChange={updateCustomerData}
                    name="GSTIN"
                    type="text"
                    className="form-control"
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <label>TIN</label>
                  <input
                    required
                    value={customerData.TIN}
                    onChange={updateCustomerData}
                    name="TIN"
                    type="text"
                    className="form-control"
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <label>PAN</label>
                  <input
                    required
                    value={customerData.PAN}
                    onChange={updateCustomerData}
                    name="PAN"
                    type="text"
                    className="form-control"
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <label>VAT NO</label>
                  <input
                    required
                    value={customerData.VAT}
                    onChange={updateCustomerData}
                    name="VAT"
                    type="text"
                    className="form-control"
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <label>DL. No.</label>
                  <input
                    required
                    value={customerData.DL}
                    onChange={updateCustomerData}
                    name="DL"
                    type="text"
                    className="form-control"
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <label>Billing Address</label>
                  <input
                    required
                    value={customerData.billing_address}
                    onChange={updateCustomerData}
                    name="billing_address"
                    type="text"
                    className="form-control"
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <label>Billing Country *</label>
                  <CreatableSelect
                    //   styles={customStyles}
                    name="billing_country"
                    className="w-100"
                    value={customerData.billing_country}
                    onChange={(val) =>
                      updateCustomerData(val, "billing_country")
                    }
                    isClearable
                    options={countryList}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <label>Billing State</label>
                  <input
                    required
                    value={customerData.billing_state}
                    onChange={updateCustomerData}
                    name="billing_state"
                    type="text"
                    className="form-control"
                  />
                </div>
              </div>

              <div className="col-md-3">
                <div className="form-group">
                  <label>Billing City</label>
                  <input
                    required
                    value={customerData.billing_city}
                    onChange={updateCustomerData}
                    name="billing_city"
                    type="text"
                    className="form-control"
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <label>Billing PIN Code</label>
                  <input
                    required
                    value={customerData.billing_PIN_Code}
                    onChange={updateCustomerData}
                    name="billing_PIN_Code"
                    type="text"
                    className="form-control"
                  />
                </div>
              </div>

              {contactType === "customer" && (
                <div className="col-12 mb-3">
                  <input
                    checked={customerData.isBillAndShipAddressSame}
                    onChange={(e) =>
                      setCustomerData((prev) => ({
                        ...prev,
                        isBillAndShipAddressSame: e.target.checked,
                        shipping_name: "",
                        shipping_display_name: "",
                        shipping_phone: "",
                        shipping_address: "",
                        shipping_country: "",
                        shipping_state: "",
                        shipping_city: "",
                        shipping_PIN_Code: "",
                      }))
                    }
                    type="checkbox"
                    className="form-check-input"
                    id="isBillAndShipAddressSame"
                    name="isBillAndShipAddressSame"
                    value="option2"
                  />{" "}
                  <label
                    className="form-check-label"
                    htmlFor="isBillAndShipAddressSame"
                  >
                    Billing and shipping addresses are the same
                  </label>
                </div>
              )}
              {contactType === "customer" &&
                !customerData.isBillAndShipAddressSame && (
                  <>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>Contact Name</label>
                        <input
                          required
                          value={customerData.shipping_name}
                          onChange={updateCustomerData}
                          name="shipping_name"
                          type="text"
                          className="form-control"
                        />
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="form-group">
                        <label>Display Name</label>
                        <input
                          required
                          value={customerData.shipping_display_name}
                          onChange={updateCustomerData}
                          name="shipping_display_name"
                          type="text"
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>Shipping Phone</label>
                        <input
                          required
                          value={customerData.shipping_phone}
                          onChange={updateCustomerData}
                          name="shipping_phone"
                          type="text"
                          className="form-control"
                        />
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="form-group">
                        <label>Shipping Email</label>
                        <input
                          required
                          value={customerData.shipping_email}
                          onChange={updateCustomerData}
                          name="shipping_email"
                          type="text"
                          className="form-control"
                        />
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="form-group">
                        <label>Shipping Address</label>
                        <input
                          required
                          value={customerData.shipping_address}
                          onChange={updateCustomerData}
                          name="shipping_address"
                          type="text"
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>Shipping Country *</label>
                        <CreatableSelect
                          //   styles={customStyles}
                          name="shipping_country"
                          className="w-100"
                          value={customerData.shipping_country}
                          onChange={(val) =>
                            updateCustomerData(val, "shipping_country")
                          }
                          isClearable
                          options={countryList}
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>Shipping State</label>
                        <input
                          required
                          value={customerData.shipping_state}
                          onChange={updateCustomerData}
                          name="shipping_state"
                          type="text"
                          className="form-control"
                        />
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="form-group">
                        <label>Shipping City</label>
                        <input
                          required
                          value={customerData.shipping_city}
                          onChange={updateCustomerData}
                          name="shipping_city"
                          type="text"
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>shipping PIN Code</label>
                        <input
                          required
                          value={customerData.shipping_pin_code}
                          onChange={updateCustomerData}
                          name="shipping_pin_code"
                          type="text"
                          className="form-control"
                        />
                      </div>
                    </div>
                  </>
                )}
            </div>

            <div className="col-12">
              {editContactState ? (
                <button
                  onClick={editContact}
                  className="btn btn-primary d-flex justify-content-center"
                >
                  {" "}
                  <i className="mdi mdi-content-save me-1"></i> Edit
                </button>
              ) : (
                <button
                  onClick={saveContact}
                  className="btn btn-primary d-flex justify-content-center"
                >
                  {" "}
                  <i className="mdi mdi-content-save me-1"></i> Save
                </button>
              )}
            </div>
          </Box>
        </>
      </Modal>
    </div>
  );
};

export default Contacts;
