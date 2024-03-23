import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { noteApi } from "../../assets/apis";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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

const DebitCreditNotes = () => {
  const [allNotes, setAllNotes] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const FYState = useSelector(state => state.FinancialYear);

  const [searchTerm, setSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
  });

  const deleteNote = async (id) => {
    try {
      const response = await axios.delete(`${noteApi}/${id}`);

      toast.success("Note deleted successfully");
      refetch();
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleApiError = (error) => {
    const errorMessage = error.response?.data?.message || "An error occurred";
   // toast.error(errorMessage);
  };

  const fetchNotes = async () => {
    try {
      const response = await axios.get(
        `${noteApi}?page=${Number(pagination.currentPage)}&pageSize=${Number(
          pagination.pageSize
        )}&search=${searchTerm}`
      );
      setAllNotes(response.data.salesNotes);
      setTotalPages(response.data.totalPages || 1);
      return response.data;
    } catch (error) {
      console.error(error);
      handleApiError(error);
    }
  };

  const { isLoading, isError, data, error, refetch } = useQuery({
    queryKey: ["notes"],
    queryFn: fetchNotes,
    enabled: false,
  });

  useEffect(() => {
    refetch();
  }, [pagination ,FYState]);

  useEffect(() => {
    const timer = setTimeout(refetch, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <div className="main-panel  ">
      <div className="content-wrapper">
        <div id="first" className="card col-lg-12 p-3">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div className="card-title"> All Notes</div>
            <button
              className="btn btn-primary d-flex justify-content-center"
              onClick={() => navigate("/manage_debit_credit_note")}
            >
              <i className="mdi  mdi-receipt me-1"></i>
              Add Note
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
              value={allNotes}
              style={{ width: "100%" }}
              id="note-table"
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
                field="type"
                header="Type"
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
                        dispatch(InvoiceActions.editNote(data));
                        navigate("/manage_debit_credit_note");
                      }}
                      className="dropdown-item-icon mdi mdi-pen text-primary me-2"
                    />
                    <i
                      style={{ cursor: "pointer" }}
                      onClick={(e) => {
                        deleteNote(data.id);
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

export default DebitCreditNotes;