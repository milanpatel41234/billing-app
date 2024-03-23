import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import { Box } from "@mui/system";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { invoiceApi } from "../../assets/apis";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

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

const Delivery_challan = () => {
  const [addInvoiceVisible, setAddInvoiceVisible] = useState(false);
  const [invoiceData, setInvoiceData] = useState({});
  const [allInvoices, setAllInvoices] = useState([]);
  const [editInvoiceState, setEditInvoiceState] = useState(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
  });

  const updateInvoiceData = (e, select_name) => {
    // Adjust based on your actual invoice data structure
    if (select_name) {
      return setInvoiceData((prev) => {
        return {
          ...prev,
          [select_name]: e,
        };
      });
    } else if (e.target?.type !== "checkbox") {
      const name = e.target.name;
      const value = e.target.value;

      return setInvoiceData((prev) => {
        return {
          ...prev,
          [name]: value,
        };
      });
    } else {
      // Adjust based on your actual checkbox logic
      return setInvoiceData((prev) => {
        return {
          ...prev,
          // Adjust based on your actual data structure
          // For example:
          // isBillAndShipAddressSame: e.target.checked,
        };
      });
    }
  };

  const saveInvoice = async () => {
    try {
      const invoice = {
        // Adjust based on your actual invoice data
        ...invoiceData,
      };
      const response = await axios.post(invoiceApi, invoice);

      toast.success("Invoice added successfully");
      resetFormAndHideModal();
      refetch();
    } catch (error) {
      handleApiError(error);
    }
  };

  const editInvoice = async () => {
    try {
      const data = {
        // Adjust based on your actual invoice data
        ...invoiceData,
      };
      const response = await axios.put(
        `${invoiceApi}/${editInvoiceState}`,
        data
      );

      toast.success("Invoice edited successfully");
      resetFormAndHideModal();
      queryClient.invalidateQueries("invoices");
      setEditInvoiceState(null);
      refetch();
    } catch (error) {
      handleApiError(error);
    }
  };

  const deleteInvoice = async (id) => {
    try {
      const response = await axios.delete(`${invoiceApi}/${id}`);

      toast.success("Invoice deleted successfully");
      refetch();
    } catch (error) {
      handleApiError(error);
    }
  };

  const resetFormAndHideModal = () => {
    setAddInvoiceVisible(false);
    setInvoiceData({});
  };

  const handleApiError = (error) => {
    const errorMessage = error.response?.data?.message || "An error occurred";
    toast.error(errorMessage);
  };

  const fetchInvoices = async () => {
    try {
      const response = await axios.get(
        `${invoiceApi}?page=${Number(pagination.currentPage)}&pageSize=${Number(
          pagination.pageSize
        )}&search=${searchTerm}`
      );
      setAllInvoices(response.data.invoices);
      setTotalPages(response.data.totalPages);
      return response.data;
    } catch (error) {
      console.error(error);
      handleApiError(error);
    }
  };

  const { isLoading, isError, data, error, refetch } = useQuery({
    queryKey: ["invoices"],
    queryFn: fetchInvoices,
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
            <div className="card-title"> All Invoices</div>
            <button
              className="btn btn-primary d-flex justify-content-center"
              onClick={() => navigate("/manage_sales_invoice")}
            >
              <i className="mdi  mdi-receipt me-1"></i>
              Add Invoice
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

          <div className="d-flex flex-column align-items-center datatable">
            <DataTable
              value={allInvoices}
              style={{ width: "100%" }}
              id="invoice-table"
              className="mytable"
            >
              <Column
                className="border-bottom border-top"
                header={() => (
                  <Checkbox
                    id="select_all"
                    name="select_all"
                    style={{ marginLeft: "5px" }}
                  />
                )}
                body={(data, rowIndex) => (
                  <Checkbox
                    id={`checkbox_${rowIndex}`}
                    name={`checkbox_${rowIndex}`}
                  />
                )}
              />
              <Column
                className="border-bottom border-top"
                header="SR."
                body={(rowData, { rowIndex }) => (
                  <p style={{ paddingLeft: "2rem" }}>
                    {pagination.currentPage * pagination.pageSize -
                      pagination.pageSize +
                      rowIndex +
                      1}
                  </p>
                )}
              />
              <Column
                className="border-bottom border-top"
                field="invoiceNumber"
                header="Inv No."
                style={{
                  height: "3rem",
                  alignItems: "center",
                  textAlign: "center",
                  minWidth: "6rem",
                }}
              />
              <Column
                className="border-bottom border-top"
                field="name"
                header="Name"
                sortable
                style={{
                  height: "3rem",
                  alignItems: "center",
                  textAlign: "center",
                  minWidth: "6rem",
                }}
              />
              <Column
                className="border-bottom border-top"
                field="date"
                header="Date"
                style={{
                  height: "3rem",
                  alignItems: "center",
                  textAlign: "center",
                  minWidth: "6rem",
                }}
              />
              <Column
                className="border-bottom border-top"
                field="amount"
                header="Amount"
                style={{
                  height: "3rem",
                  alignItems: "center",
                  textAlign: "center",
                  minWidth: "6rem",
                }}
              />
              <Column
                className="border-bottom border-top"
                field="tax"
                header="Tax"
                style={{
                  height: "3rem",
                  alignItems: "center",
                  textAlign: "center",
                  minWidth: "6rem",
                }}
              />
              <Column
                className="border-bottom border-top"
                field="discount"
                header="Discount"
                style={{
                  height: "3rem",
                  alignItems: "center",
                  textAlign: "center",
                  minWidth: "6rem",
                }}
              />
              <Column
                className="border-bottom border-top"
                field="total"
                header="Total"
                style={{
                  height: "3rem",
                  alignItems: "center",
                  textAlign: "center",
                  minWidth: "6rem",
                }}
              />
              <Column
                className="border-bottom border-top"
                field="status"
                header="Status"
                style={{
                  height: "3rem",
                  alignItems: "center",
                  textAlign: "center",
                  minWidth: "6rem",
                }}
              />
              <Column
                className="border-bottom border-top"
                field="paid"
                header="Paid"
                style={{
                  height: "3rem",
                  alignItems: "center",
                  textAlign: "center",
                  minWidth: "6rem",
                }}
              />
              <Column
                className="border-bottom border-top"
                field="balance"
                header="Balance"
                style={{
                  height: "3rem",
                  alignItems: "center",
                  textAlign: "center",
                  minWidth: "6rem",
                }}
              />
              <Column
                className="border-bottom border-top"
                field="paidDate"
                header="Paid Date"
                style={{
                  height: "3rem",
                  alignItems: "center",
                  textAlign: "center",
                  minWidth: "6rem",
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
                        setEditInvoiceState(data.id);

                        setInvoiceData({
                          // Adjust based on your actual invoice data
                          ...data,
                        });
                        setAddInvoiceVisible(true);
                      }}
                      className="dropdown-item-icon mdi mdi-pen text-primary me-2"
                    />
                    <i
                      style={{ cursor: "pointer" }}
                      onClick={(e) => {
                        deleteInvoice(data.id);
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

      {/* <Modal
        open={addInvoiceVisible}
        onClose={() => {setAddInvoiceVisible(false)
        setInvoiceData({});
        setEditInvoiceState(false)
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
              <h5>INVOICE INFORMATION</h5>
            </div>
           // <InvoiceModal
           //   invoiceData={invoiceData}
           //   updateInvoiceData={updateInvoiceData}
           // />
            <div className="col-12">
              {editInvoiceState ? (
                <button onClick={editInvoice} className="btn btn-primary d-flex justify-content-center">
                  {" "}
                  <i className="mdi mdi-content-save me-1"></i> Edit
                </button>
              ) : (
                <button onClick={saveInvoice} className="btn btn-primary d-flex justify-content-center">
                  {" "}
                  <i className="mdi mdi-content-save me-1"></i> Save
                </button>
              )}
            </div>
          </Box>
        </>
      </Modal> */}
    </div>
  );
};

export default Delivery_challan;
