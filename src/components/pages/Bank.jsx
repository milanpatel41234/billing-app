import React, { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "primereact/button";
import Modal from "@mui/material/Modal";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import Footer from "../helper/Footer";
import { bankApi } from "../assets/apis"; // Assuming you have an API file for banks
import { Box } from "@mui/material";

export const fetchBanks = async () => {
  const response = await axios.get(bankApi);
  return response.data;
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Bank = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editState, setEditState] = useState(false);
  const [visible, setVisible] = useState(false);
  const [bankData, setBankData] = useState([]);
  const queryClient = useQueryClient();
  const [addBank, setAddBank] = useState({});

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["bank"],
    queryFn: fetchBanks,
  });

  useEffect(() => {
    if (data?.banks) {
      setBankData(data.banks);
    }
  }, [data]);

  const saveBank = async () => {
    try {
      const response = await axios.post(bankApi, addBank);

      if (response.status === 200) {
        toast.success("Bank added successfully");
        setVisible(false);
        queryClient.invalidateQueries("bank");
        setAddBank({
          name: "",
          address: "",
          contact: "",
        });
      } else {
        toast.error("Failed to add bank. Please try again.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add bank. Please try again."
      );
    }
  };

  const editBank = async () => {
    try {
      const response = await axios.put(`${bankApi}/${editState}`, addBank);

      if (response.status === 200) {
        toast.success("Bank edited successfully");
        setVisible(false);
        queryClient.invalidateQueries("bank");
        setAddBank({});
        setEditState(false);
      } else {
        toast.error("Failed to edit bank. Please try again.");
      }
    } catch (error) {
      // Handle errors
    }
  };

  const deleteBank = async (id) => {
    try {
      const response = await axios.delete(`${bankApi}/${id}`);

      if (response.status === 200) {
        toast.success("Bank deleted successfully");
        queryClient.invalidateQueries("bank");
      } else {
        toast.error("Failed to delete bank. Please try again.");
      }
    } catch (error) {
      // Handle errors
    }
  };

  const setEditData = (data) => {
    setEditState(data.id);
    setAddBank({
      name: data.name,
      branch: data.branch,
      account_no: data.account_no,
      discription: data.discription,
      ifsc: data.ifsc,
    });
    setVisible(true);
  };

  const onInputChange = (value) => {
    setSearchTerm(value);
  };

  const filteredData = bankData?.filter((item) =>
    Object.values(item).some((val) =>
      val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="main-panel">
      <Modal
        open={visible}
        onClose={() => {
          setVisible(false);
          setEditState(false);
          setAddBank({
            name: "",
            address: "",
            contact: "",
          });
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        header="Add Bank"
      >
        <Box sx={style}>
          <h3>{editState ? "Edit Bank" : "Add New Bank"}</h3>
          <div className="row">
            <div className="col-6 mt-2">
              <label>Bank Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Bank"
                name="name"
                value={addBank.name}
                onChange={(e) =>
                  setAddBank((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }
              />
            </div>
            <div className="col-6 mt-2">
              <label>Account No.</label>{" "}
              <input
                type="text"
                className="form-control"
                placeholder="Account No."
                name="account_no"
                value={addBank.account_no}
                onChange={(e) =>
                  setAddBank((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }
              />
            </div>
            <div className="col-6 mt-2">
              <label>Branch Name</label>{" "}
              <input
                type="text"
                className="form-control"
                placeholder="Branch"
                name="branch"
                value={addBank.branch}
                onChange={(e) =>
                  setAddBank((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }
              />
            </div>
            <div className="col-6 mt-2">
              <label>IFSC Code</label>{" "}
              <input
                type="text"
                className="form-control"
                placeholder="IFSC Code"
                name="ifsc"
                value={addBank.ifsc}
                onChange={(e) =>
                  setAddBank((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }
              />
            </div>
            <div className="col-12 mt-2">
              <label>Discription</label>{" "}
              <textarea
                type="text"
                className="form-control"
                style={{ height: "60px", resize: "none", overflow: "hidden" }}
                name="discription"
                value={addBank.discription}
                onChange={(e) =>
                  setAddBank((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="col-9 mt-2">
            {editState ? (
              <Button onClick={editBank} className="btn btn-primary">
                Edit
              </Button>
            ) : (
              <Button onClick={saveBank} className="btn btn-primary">
                Save
              </Button>
            )}
          </div>
        </Box>
      </Modal>

      <div className="content-wrapper  ">
        <div id="first" className="card col-lg-12 p-3">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div className="card-title"> Bank Report</div>
            <button
              className="btn btn-primary"
              onClick={() => setVisible(true)}
            >
              Add Bank
            </button>
          </div>

          <div className="p-mb-4 mb-3 d-flex justify-content-between align-items-end w-100">
            <span className="p-input-icon-left">
              <InputText
                className="rounded rounded-4"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => {
                  onInputChange(e.target.value);
                }}
              />
            </span>
          </div>
          <div className="d-flex flex-column  align-items-center">
            <DataTable
              value={filteredData}
              paginator
              rows={5}
              paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
              rowsPerPageOptions={[5, 10, 20]}
              style={{ width: "100%" }}
              className="mytable"
            >
              <Column
                className="border-bottom border-top"
                header="SR. No."
                body={(rowData, { rowIndex }) => rowIndex + 1}
              />

              <Column
                className="border-bottom border-top"
                field="name"
                header="BANK NAME "
                sortable
              />
              <Column
                className="border-bottom border-top"
                field="branch"
                header="BRANCH"
                sortable
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
                    }}
                  >
                    <i
                      onClick={(e) => setEditData(data)}
                      className="dropdown-item-icon mdi mdi-pen text-primary me-2"
                    />
                    <i
                      onClick={(e) => deleteBank(data.id)}
                      className="dropdown-item-icon mdi mdi-delete-forever text-primary me-2"
                    />
                  </div>
                )}
                header="ACTIONS"
              />
            </DataTable>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Bank;
