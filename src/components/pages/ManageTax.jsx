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
import { taxApi } from "../assets/apis"; 

import { Box } from "@mui/material";

export const fetchTaxes = async () => {
  const response = await axios.get(taxApi);
  return response.data;
};
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Tax = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editState, setEditState] = useState(false);
  const [visible, setVisible] = useState(false);
  const [taxData, setTaxData] = useState([]);
  const queryClient = useQueryClient();
  const [addTax, setAddTax] = useState({
    name: "",
    rate: "",
    description: "",
  });

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["tax"],
    queryFn: fetchTaxes,
  });
  useEffect(() => {
    if (data?.taxes) {
      setTaxData(data.taxes);
    }
  }, [data]);

  const saveTax = async () => {
    try {
      const response = await axios.post(taxApi, addTax);

      if (response.status === 200) {
        toast.success("Tax added successfully");
        setVisible(false);
        queryClient.invalidateQueries("tax");
        setAddTax({
          name: "",
          rate: 0,
          description: "",
        });
      } else {
        toast.error("Failed to add tax. Please try again.");
      }
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error);
        toast.error(error.response.data.message);
      } else if (error.request) {
        // The request was made but no response was received
        toast.error(
          "No response from the server. Please check your internet connection."
        );
      } else {
        // Something happened in setting up the request that triggered an Error
        toast.error(`An error occurred: ${error.message}`);
      }
    }
  };

  const editTax = async () => {
    try {
      const response = await axios.put(`${taxApi}/${editState}`, addTax);

      if (response.status === 200) {
        toast.success("Tax edited successfully");
        setVisible(false);
        queryClient.invalidateQueries("tax");
        setAddTax({
          name: "",
          rate: "",
          description: "",
        });
        setEditState(false);
      } else {
        toast.error("Failed to edit tax. Please try again.");
      }
    } catch (error) {
      if (error.response) {
        toast.error(
          `Server responded with an error: ${error.response.data.message}`
        );
      } else if (error.request) {
        toast.error(
          "No response from the server. Please check your internet connection."
        );
      } else {
        toast.error(`An error occurred: ${error.message}`);
      }
    }
  };

  const deleteTax = async (id) => {
    try {
      const response = await axios.delete(`${taxApi}/${id}`);

      if (response.status === 200) {
        toast.success("Tax deleted successfully");
        queryClient.invalidateQueries("tax");
      } else {
        toast.error("Failed to delete tax. Please try again.");
      }
    } catch (error) {
      if (error.response) {
        toast.error(`${error.response.data.message}`);
      } else if (error.request) {
        toast.error(
          "No response from the server. Please check your internet connection."
        );
      } else {
        toast.error(`An error occurred: ${error.message}`);
      }
    }
  };

  const setEditData = (data) => {
    setEditState(data.name);
    setAddTax({
      name: data.name,
      rate: data.rate,
      description: data.description,
    });
    setVisible(true);
  };

  const onInputChange = (value) => {
    setSearchTerm(value);
  };

  const filteredData = taxData?.filter((item) =>
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
          setAddTax({
            name: "",
            rate: "",
            description: "",
          });
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        header="Add Tax"
      >
        <Box sx={style}>
          <div className="col-6 mt-2">
            <label>Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Tax"
              name="name"
              value={addTax.name}
              onChange={(e) =>
                setAddTax((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
            />
          </div>
          <div className="col-6 mt-2">
            <label>rate</label>{" "}
            <input
              type="number"
              className="form-control"
              placeholder="rate"
              name="rate"
              value={addTax.rate}
              onChange={(e) =>
                setAddTax((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
            />
          </div>
          <div className="col-9 mt-2">
            <label className="form-control-label" htmlFor="input-address">
              Description
            </label>
            <textarea
              className="form-control form-control-alternative"
              rows="7"
              style={{
                borderRadius: "5px",
                resize: "none",
                minHeight: "80px",
              }}
              name="description"
              value={addTax.description}
              onChange={(e) =>
                setAddTax((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
            />
          </div>
          <div className="col-9 mt-2">
            {editState ? (
              <Button onClick={editTax} className="btn btn-primary">
                Edit
              </Button>
            ) : (
              <Button onClick={saveTax} className="btn btn-primary">
                Save
              </Button>
            )}
          </div>
        </Box>
      </Modal>

      <div className="content-wrapper  ">
        <div id="first" className="card col-lg-12 p-3">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div className="card-title"> Tax Report</div>
            <button
              className="btn btn-primary"
              onClick={() => setVisible(true)}
            >
              Add Tax
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
              id="review-table"
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
                header="TAX NAME "
                sortable
                style={{
                  height: "3rem",
                  alignItems: "center",
                  textAlign: "center",
                  minWidth: "3rem",
                  padding: '0 5px'
                }}
              />
              <Column
                className="border-bottom border-top"
                field="rate"
                header="PERCENT % "
                sortable
                style={{
                  height: "3rem",
                  alignItems: "center",
                  textAlign: "center",
                  minWidth: "9rem",
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
                    }}
                  >
                    <i
                      onClick={(e) => setEditData(data)}
                      className="dropdown-item-icon mdi mdi-pen text-primary me-2"
                    />
                    <i
                      onClick={(e) => deleteTax(data.name)}
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

export default Tax;
