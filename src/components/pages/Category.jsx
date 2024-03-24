import React, { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import Footer from "../helper/Footer";
import { categoryApi } from "../assets/apis"; // Assuming you have an API file for categories
import { Box, Modal } from "@mui/material";

export const fetchCategories = async () => {
  const response = await axios.get(categoryApi);
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

const Category = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editState, setEditState] = useState(false);
  const [visible, setVisible] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const queryClient = useQueryClient();

  const [addCategory, setAddCategory] = useState({
    name: "",
    active: false,
    description: "",
  });

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["category"],
    queryFn: fetchCategories,
  });
  useEffect(() => {
    // Check if data has categories and set the state
    if (data?.categories) {
      setCategoryData(data.categories);
    }
  }, [data]);

  const saveCategory = async () => {
    try {
      const response = await axios.post(categoryApi, addCategory);

      toast.success("Category added successfully");
      setVisible(false);
      queryClient.invalidateQueries("category");
      setAddCategory({
        name: "",
        active: false,
        description: "",
      });
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message);
    }
  };

  const editCategory = async () => {
    try {
      const response = await axios.put(
        `${categoryApi}/${editState}`,
        addCategory
      );

      toast.success("Category edited successfully");
      setVisible(false);
      queryClient.invalidateQueries("category");
      setAddCategory({
        name: "",
        active: false,
        description: "",
      });
      setEditState(false);
    } catch (error) {
      toast.error(error.response.message);
    }
  };

  const deleteCategory = async (id) => {
    try {
      const response = await axios.delete(`${categoryApi}/${id}`);

      toast.success("Category deleted successfully");
      queryClient.invalidateQueries("category");
    } catch (error) {
      toast.error(error);
    }
  };

  const setEditData = (id, data) => {
    setEditState(id);
    setAddCategory({
      name: data.name,
      active: data.active,
      description: data.description,
    });
    setVisible(true);
  };

  const filteredData = categoryData?.filter((item) =>
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
          setAddCategory({
            name: "",
            active: false,
            description: "",
          });
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        header="Add Category"
      >
         <Box sx={style}>
        <div className="col-12 mt-2">
          <label>Name</label>
          <InputText
            type="text"
            className="form-control"
            placeholder="Category"
            name="name"
            value={addCategory.name}
            onChange={(e) =>
              setAddCategory((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }))
            }
          />
        </div>
        <div className="col-6 mt-2">
          <label>Active? </label>{" "}
          <input
            type="checkbox"
            name="active"
            checked={addCategory.active}
            onChange={(e) =>
              setAddCategory((prev) => ({
                ...prev,
                [e.target.name]: e.target.checked,
              }))
            }
          />
        </div>
        <div className="col-12 mt-2">
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
            value={addCategory.description}
            onChange={(e) =>
              setAddCategory((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }))
            }
          />
        </div>
        <div className="col-9 mt-2">
          {editState ? (
            <Button onClick={editCategory} className="btn btn-primary">
              Edit
            </Button>
          ) : (
            <Button onClick={saveCategory} className="btn btn-primary">
              Save
            </Button>
          )}
        </div>
        </Box>
      </Modal>

     

      <div className="content-wrapper  ">
        <div id="first" className="card col-lg-12 p-3">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div className="card-title"> Category Report</div>
            <button
              className="btn btn-primary"
              onClick={() => setVisible(true)}
            >
              Add Category
            </button>
          </div>

          <div className="p-mb-4 mb-3 d-flex justify-content-between align-items-end w-100">
            <span className="p-input-icon-left">
              <InputText
                className="rounded rounded-4"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
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
                header="CATEGORY NAME"
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
                body={(rowData) => (rowData.active ? "Active" : "Inactive")}
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
                      onClick={(e) => deleteCategory(data.name)}
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

export default Category;
