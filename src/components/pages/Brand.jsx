import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import Footer from "../helper/Footer";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { brandApi } from "../assets/apis";
import { Box, Modal } from "@mui/material";

export const fetchBrands = async () => {
  const response = await axios.get(brandApi);
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

const Brand = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editState, setEditState] = useState(false);
  const [visible, setVisible] = useState(false);
  const [brandData, setBrandData] = useState([]);
  const queryClient = useQueryClient();
  const [addBrand, setAddBrand] = useState({
    name: "",
    active: false,
    description: "",
  });

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["brand"],
    queryFn: fetchBrands,
  });
  useEffect(() => {
    // Check if data has categories and set the state
    if (data?.brands) {
      setBrandData(data.brands);
    }
  }, [data]);

  const saveBrand = async () => {
    try {
      const response = await axios.post(brandApi, addBrand);

      toast.success("Brand added successfully");
      setVisible(false);
      queryClient.invalidateQueries("brand");
      setAddBrand({
        name: "",
        active: false,
        description: "",
      });
    } catch (error) {}
  };
  const editBrand = async () => {
    try {
      const response = await axios.put(`${brandApi}/${editState}`, addBrand);

      toast.success("Brand edited successfully");
      setVisible(false);
      queryClient.invalidateQueries("brand");
      setAddBrand({
        name: "",
        active: false,
        description: "",
      });
      setEditState(false);
    } catch (error) {
      toast.error(error);
    }
  };
  const deleteBrand = async (id) => {
    try {
      const response = await axios.delete(`${brandApi}/${id}`);

      toast.success("Brand deleted successfully");
      queryClient.invalidateQueries("brand");
    } catch (error) {
      toast.error(error);
    }
  };

  const setEditData = (id, data) => {
    setEditState(id);
    setAddBrand({
      name: data.name,
      active: data.active,
      description: data.description,
    });
    setVisible(true);
  };

  const onInputChange = (value) => {
    setSearchTerm(value);
  };
  const filteredData = brandData?.filter((item) =>
    Object.values(item).some((val) =>
      val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="main-panel">
      <Modal
        modal
        open={visible}
        onClose={() => {
          setVisible(false);
          setEditState(false);
          setAddBrand({
            name: "",
            active: false,
            description: "",
          });
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        header="Add Brand"
      >
         <Box sx={style}>
        <div className="col-12 mt-2">
          <label>Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Brand"
            name="name"
            value={addBrand.name}
            onChange={(e) =>
              setAddBrand((prev) => {
                return { ...prev, [e.target.name]: e.target.value };
              })
            }
          />
        </div>
        <div className="col-6 mt-2">
          <label>Active ? </label>{" "}
          <input
            type="checkbox"
            name="active"
            checked={addBrand.active}
            onChange={(e) =>
              setAddBrand((prev) => {
                return { ...prev, [e.target.name]: e.target.checked };
              })
            }
          />
        </div>
        <div className="col-12 mt-2">
          <label className="form-control-label" for="input-address">
            Description
          </label>
          <textarea
            className="form-control form-control-alternative"
            rows="7"
            style={{ borderRadius: "5px", resize: "none", minHeight: "80px" }}
            name="description"
            value={addBrand.description}
            onChange={(e) =>
              setAddBrand((prev) => {
                return { ...prev, [e.target.name]: e.target.value };
              })
            }
          />
        </div>
        <div className="col-9 mt-2">
          {editState ? (
            <Button onClick={editBrand} className="btn btn-primary">
              Edit
            </Button>
          ) : (
            <Button onClick={saveBrand} className="btn btn-primary">
              Save
            </Button>
          )}
        </div>
        </Box>
      </Modal>

     

      <div className="content-wrapper  ">
        <div id="first" className="card col-lg-12 p-3">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div className="card-title"> Sales Report</div>
            <button
              className="btn btn-primary"
              onClick={() => setVisible(true)}
            >
              Add Brand
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
                header="BRAND NAME"
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
                field="active"
                body={(rowData) => (rowData.active ? "Active" : "InActive")}
                header="ACTIVE"
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
                      onClick={(e) => setEditData(data.name, data)}
                      className="dropdown-item-icon mdi mdi-pen text-primary me-2"
                    />
                    <i
                      onClick={(e) => deleteBrand(data.name)}
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

export default Brand;
