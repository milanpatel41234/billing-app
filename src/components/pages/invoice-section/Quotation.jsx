import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { quotationApi } from "../../assets/apis"; // assuming this is where your quotation API resides
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { InvoiceActions } from "../../redux-store/Index";

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

const Quotations = () => {
  const [allQuotations, setAllQuotations] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
  });

  const deleteQuotation = async (id) => {
    try {
      const response = await axios.delete(`${quotationApi}/${id}`);

      toast.success("Quotation deleted successfully");
      refetch();
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleApiError = (error) => {
    const errorMessage = error.response?.data?.message || "An error occurred";
    // toast.error(errorMessage);
  };

  const fetchQuotations = async () => {
    try {
      const response = await axios.get(
        `${quotationApi}?page=${Number(
          pagination.currentPage
        )}&pageSize=${Number(pagination.pageSize)}&search=${searchTerm}`
      );
      setAllQuotations(response.data.quotations);
      setTotalPages(response.data.totalPages);
      return response.data;
    } catch (error) {
      console.error(error);
      handleApiError(error);
    }
  };

  const { isLoading, isError, data, error, refetch } = useQuery({
    queryKey: ["quotations"],
    queryFn: fetchQuotations,
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
            <div className="card-title"> All Quotations</div>
            <button
              className="btn btn-primary d-flex justify-content-center"
              onClick={() => navigate("/manage_quotation")}
            >
              <i className="mdi  mdi-receipt me-1"></i>
              Add Quotation
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
              value={allQuotations}
              style={{ width: "100%" }}
              id="quotation-table"
              className="mytable"
            >
              <Column
                className="border-bottom border-top"
                header="SR."
                style={{
                  height: "3rem",
                  alignItems: "center",
                  textAlign: "center",
                  minWidth: "2rem",
                }}
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
                field="quotation"
                header="Quote No."
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
                field="total_tax"
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
                field="invoiced"
                header="Invoiced"
                style={{
                  height: "3rem",
                  alignItems: "center",
                  textAlign: "center",
                  minWidth: "6rem",
                }}
              />
              <Column
                className="border-bottom border-top"
                field="invoice"
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
                        dispatch(InvoiceActions.editQuotation(data));
                        navigate("/manage_quotation");
                      }}
                      className="dropdown-item-icon mdi mdi-pen text-primary me-2"
                    />
                    <i
                      style={{ cursor: "pointer" }}
                      onClick={(e) => {
                        deleteQuotation(data.id);
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
    </div>
  );
};

export default Quotations;
