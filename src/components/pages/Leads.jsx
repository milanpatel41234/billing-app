import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import { Box } from "@mui/system";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { leadApi } from "../assets/apis";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { countryList as rawArray } from "../assets/countryList";
import CreatableSelect from "react-select/creatable";
import axios from "axios";
import toast from "react-hot-toast";
import { leadIndustryOptions, leadRateOptions, leadSourceArray, leadStatusOptions } from "../assets/leadOptions";

const countryList = rawArray.map((name) => ({ label: name, value: name }));
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

const Leads = () => {
  const [addLeadVisible, setAddLeadVisible] = useState(false);
  const [leadData, setLeadData] = useState({});
  const [allLeads, setAllLeads] = useState([]);
  const [editLeadState, setEditLeadState] = useState(null);
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
  });

  const updateLeadData = (e, select_name) => {
    if (select_name) {
      return setLeadData((prev) => {
        return {
          ...prev,
          [select_name]: e,
        };
      });
    } else if (e.target?.type !== "checkbox") {
      const name = e.target.name;
      const value = e.target.value;

      return setLeadData((prev) => {
        return {
          ...prev,
          [name]: value,
        };
      });
    } else {
      return setLeadData((prev) => {
        return {
          ...prev,
          shipping_address: "",
          shipping_city: "",
          shipping_contact_name: "",
          shipping_display_name: "",
          shipping_country: "",
          shipping_email: "",
          shipping_pin_code: "",
          shipping_shipping_phone: "",
          shipping_state: "",
          isBillAndShipAddressSame: e.target.checked,
        };
      });
    }
  };

  const saveLead = async () => {
    const loading = toast.loading('Saving data...')
    try {
      const lead = {
        ...leadData,
        billing_country: leadData.billing_country?.value || '',
        shipping_country: leadData.shipping_country?.value || '',
        source:leadData.source?.value || '',
        status: leadData.status?.value || '',
        rating : leadData.rating?.value  || '' ,
        industry: leadData.industry?.value || '' ,
      };
      const response = await axios.post(leadApi, lead);

      toast.success("Lead added successfully");
      resetFormAndHideModal();
      refetch();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred";
       toast.error(errorMessage);
    }
    toast.dismiss(loading)
  };

  const editLead = async () => {
    const loading = toast.loading('Saving data...')
    try {
      const data = {
        ...leadData,
        billing_country: leadData.billing_country?.value || '',
        shipping_country: leadData.shipping_country?.value || '',
        source:leadData.source?.value || '',
        status: leadData.status?.value || '',
        rating : leadData.rating?.value  || '' ,
        industry: leadData.industry?.value || '' ,
      };
      const response = await axios.put(`${leadApi}/${editLeadState}`, data);

      toast.success("Lead edited successfully");
      resetFormAndHideModal();
      queryClient.invalidateQueries("leads");
      setEditLeadState(null);
      refetch();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred";
       toast.error(errorMessage);
    }
    toast.dismiss(loading)
  };

  const deleteLead = async (id) => {
    const loading = toast.loading('Deleting data...');
    try {
      const response = await axios.delete(`${leadApi}/${id}`);

      toast.success("Lead deleted successfully");
      refetch();
    } catch (error) {
      handleApiError(error);
    }
    toast.dismiss(loading)
  };

  const resetFormAndHideModal = () => {
    setAddLeadVisible(false);
    setLeadData({});
  };

  const handleApiError = (error) => {
    const errorMessage = error.response?.data?.message || "An error occurred";
     toast.error(errorMessage);
  };

  const fetchLeads = async () => {
    try {
      const response = await axios.get(
        `${leadApi}?page=${Number(pagination.currentPage)}&pageSize=${Number(
          pagination.pageSize
        )}&search=${searchTerm}`
      );
      setAllLeads(response.data.leads);
      setTotalPages(response.data.totalPages);
      return response.data;
    } catch (error) {
      console.error(error);
      // handleApiError(error);
    }
  };

  const { isLoading, isError, data, error, refetch } = useQuery({
    queryKey: ["leads"],
    queryFn: fetchLeads,
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
            <div className="card-title"> All Leads</div>
            <button
              className="btn btn-primary d-flex justify-content-center"
              onClick={() => setAddLeadVisible(true)}
            >
              <i className="mdi  mdi-account-plus me-1"></i>
              Add Lead
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
              value={allLeads}
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
                  minWidth: "9rem",
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
                  minWidth: "5rem",
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
                  minWidth: "5rem",
                  padding: '0 5px'
                }}
              />
              <Column
                className="border-bottom border-top"
                field="phone"
                header="PHONE"
                sortable
                style={{
                  height: "3rem",
                  alignItems: "center",
                  textAlign: "center",
                  minWidth: "5rem",
                  padding: '0 5px'
                }}
              />
              <Column
                className="border-bottom border-top"
                body={(data)=> data.status || '-'}
                header="STATUS"
                style={{
                  height: "3rem",
                  alignItems: "center",
                  textAlign: "center",
                  minWidth: "5rem",
                  padding: '0 5px'
                }}
              />
              <Column
                className="border-bottom border-top"
               
                body={(data)=> 'false'}
                header="CONVERTED"
                style={{
                  height: "3rem",
                  alignItems: "center",
                  textAlign: "center",
                  minWidth: "5rem",
                  padding: '0 5px'
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
                        setEditLeadState(data.id);

                        setLeadData({
                          ...data,
                          billing_country: {
                            value: data.billing_country,
                            label: data.billing_country,
                          },
                          shipping_country: {
                            value: data.shipping_country,
                            label: data.shipping_country,
                          },
                          source: {
                            value: data.source,
                            label: data.source || 'Select..',
                          },
                          rating: {
                            value: data.rating,
                            label: data.rating|| 'Select..',
                          },
                          status: {
                            value: data.status,
                            label: data.status|| 'Select..',
                          },
                          industry: {
                            value: data.industry,
                            label: data.industry|| 'Select..',
                          },
                        });
                        setAddLeadVisible(true);
                      }}
                      className="dropdown-item-icon mdi mdi-pen text-primary me-2"
                    />
                    <i
                      style={{ cursor: "pointer" }}
                      onClick={(e) => {
                        deleteLead(data.id);
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

      {/* modal for add lead  */}

      <Modal
        open={addLeadVisible}
        onClose={() => {
          setAddLeadVisible(false);
          setLeadData({});
          setEditLeadState(false);
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
              {/* Additional JSX for lead-specific modal content */}
            </div>
            <div className="col-12 ">
              <h5>LEAD INFORMATION</h5>
            </div>

            <div className="row">
              <div className="col-md-3">
                <div className="form-group">
                  <label>Customer Name *</label>
                  <input
                    required
                    value={leadData.name}
                    onChange={updateLeadData}
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
                    value={leadData.display_name}
                    onChange={updateLeadData}
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
                    value={leadData.phone}
                    onChange={updateLeadData}
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
                    value={leadData.email}
                    onChange={updateLeadData}
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
                    value={leadData.GSTIN}
                    onChange={updateLeadData}
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
                    value={leadData.TIN}
                    onChange={updateLeadData}
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
                    value={leadData.PAN}
                    onChange={updateLeadData}
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
                    value={leadData.VAT}
                    onChange={updateLeadData}
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
                    value={leadData.DL}
                    onChange={updateLeadData}
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
                    value={leadData.billing_address}
                    onChange={updateLeadData}
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
                    name="billing_country"
                    className="w-100"
                    value={leadData.billing_country}
                    onChange={(val) => updateLeadData(val, "billing_country")}
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
                    value={leadData.billing_state}
                    onChange={updateLeadData}
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
                    value={leadData.billing_city}
                    onChange={updateLeadData}
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
                    value={leadData.billing_PIN_Code}
                    onChange={updateLeadData}
                    name="billing_PIN_Code"
                    type="text"
                    className="form-control"
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <label>Lead Source</label>
                  <CreatableSelect
                    name="source"
                    className="w-100"
                    value={leadData.source}
                    onChange={(val) => updateLeadData(val, "source")}
                    isClearable
                    options={leadSourceArray}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <label>Lead Status</label>
                  <CreatableSelect
                    name="status"
                    className="w-100"
                    value={leadData.status}
                    onChange={(val) => updateLeadData(val, "status")}
                    isClearable
                    options={leadStatusOptions}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <label>Lead Industry</label>
                  <CreatableSelect
                    name="industry"
                    className="w-100"
                    value={leadData.industry}
                    onChange={(val) => updateLeadData(val, "industry")}
                    isClearable
                    options={leadIndustryOptions}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <label>Lead Rate</label>
                  <CreatableSelect
                    name="rating"
                    className="w-100"
                    value={leadData.rating}
                    onChange={(val) => updateLeadData(val, "rating")}
                    isClearable
                    options={leadRateOptions}
                  />
                </div>
              </div>



              <div className="col-12 mb-3">
                <input
                  checked={leadData.isBillAndShipAddressSame}
                  onChange={(e) =>
                    setLeadData((prev) => ({
                      ...prev,
                      isBillAndShipAddressSame: e.target.checked,
                      shipping_name: "",
                      shipping_display_name: "",
                      shipping_phone: "",
                      shipping_email: "",
                      shipping_address: "",
                      shipping_country: "",
                      shipping_state: "",
                      shipping_city: "",
                      shipping_pin_code: "",
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
              {!leadData.isBillAndShipAddressSame && (
                <>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Contact Name</label>
                      <input
                        required
                        value={leadData.shipping_name}
                        onChange={updateLeadData}
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
                        value={leadData.shipping_display_name}
                        onChange={updateLeadData}
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
                        value={leadData.shipping_phone}
                        onChange={updateLeadData}
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
                        value={leadData.shipping_email}
                        onChange={updateLeadData}
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
                        value={leadData.shipping_address}
                        onChange={updateLeadData}
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
                        value={leadData.shipping_country}
                        onChange={(val) =>
                          updateLeadData(val, "shipping_country")
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
                        value={leadData.shipping_state}
                        onChange={updateLeadData}
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
                        value={leadData.shipping_city}
                        onChange={updateLeadData}
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
                        value={leadData.shipping_pin_code}
                        onChange={updateLeadData}
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
              {editLeadState ? (
                <button
                  onClick={editLead}
                  className="btn btn-primary d-flex justify-content-center"
                >
                  {" "}
                  <i className="mdi mdi-content-save me-1"></i> Edit
                </button>
              ) : (
                <button
                  onClick={saveLead}
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

export default Leads;
