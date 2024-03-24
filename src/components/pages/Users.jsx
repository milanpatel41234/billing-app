import React, { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import Footer from "../helper/Footer";
import { userApi } from "../assets/apis"; // Assuming you have an API file for users
import BackdropOverlay from "../uiModals/Backdrop";

export const fetchUsers = async () => {
  const response = await axios.get(userApi);
  return response.data;
};

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editState, setEditState] = useState(false);
  const [visible, setVisible] = useState(false);
  const [userData, setUserData] = useState([]);
  const queryClient = useQueryClient();

  const [addUser, setAddUser] = useState({
    
    email: "",
    // Add other user properties as needed
  });

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUsers,
  });

  useEffect(() => {
    // Check if data has users and set the state
    if (data?.users) {
      setUserData(data.users);
    }
  }, [data]);

  const saveUser = async () => {
    try {
      const response = await axios.post(userApi, addUser);

      toast.success("User added successfully");
      setVisible(false);
      queryClient.invalidateQueries("user");
      setAddUser({
        username: "",
        email: "",
        // Reset other user properties as needed
      });
    } catch (error) {
      toast.error(error);
    }
  };

  const editUser = async () => {
    try {
      const response = await axios.put(
        `${userApi}/${editState}`,
        addUser
      );

      toast.success("User edited successfully");
      setVisible(false);
      queryClient.invalidateQueries("user");
      setAddUser({
        username: "",
        email: "",
        // Reset other user properties as needed
      });
      setEditState(false);
    } catch (error) {
      toast.error(error.response.message);
    }
  };

  const deleteUser = async (id) => {
    try {
      const response = await axios.delete(`${userApi}/${id}`);

      toast.success("User deleted successfully");
      queryClient.invalidateQueries("user");
    } catch (error) {
      toast.error(error);
    }
  };

  const setEditData = (id, data) => {
    setEditState(id);
    setAddUser({
      username: data.username,
      email: data.email,
      // Set other user properties as needed
    });
    setVisible(true);
  };

  const filteredData = userData?.filter((item) =>
    Object.values(item).some((val) =>
      val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="main-panel">
      <Dialog
        header="Add User"
        visible={visible}
        modal
        style={{
          width: "50vw",
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "20px",
        }}
        onHide={() => {
          setVisible(false);
          setEditState(false);
          setAddUser({
            username: "",
            email: "",
            // Reset other user properties as needed
          });
        }}
      >
        <div className="col-6 mt-2">
          <label>Name</label>
          <InputText 
            type="text"
            className="form-control"
            placeholder="Name"
            name="name"
            value={addUser.name}
            onChange={(e) =>
              setAddUser((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }))
            }
          />
        </div>
        <div className="col-6 mt-2">
          <label>Phone Number</label>
          <InputText 
            type="number"
            className="form-control"
            placeholder="Phone Number"
            name="phone"
            value={addUser.phone}
            onChange={(e) =>
              setAddUser((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }))
            }
          />
        </div>
        
        <div className="col-6 mt-2">
          <label>Email</label>
          <InputText 
            type="email"
            className="form-control"
            placeholder="Email"
            name="email"
            value={addUser.email}
            onChange={(e) =>
              setAddUser((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }))
            }
          />
        </div>
        <div className="col-6 mt-2">
          <label>Password</label>
          <InputText 
            type="password"
            className="form-control"
            placeholder="Password"
            name="password"
            value={addUser.password}
            onChange={(e) =>
              setAddUser((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }))
            }
          />
        </div>
        {/* Add other input fields for user properties as needed */}
        <div className="col-9 mt-2">
          {editState ? (
            <Button onClick={editUser} className="btn btn-primary">
              Edit
            </Button>
          ) : (
            <Button onClick={saveUser} className="btn btn-primary">
              Save
            </Button>
          )}
        </div>
      </Dialog>

      <BackdropOverlay visible={visible} />

      <div className="content-wrapper">
        <div id="first" className="card col-lg-12 p-3">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div className="card-title"> Users</div>
            <button
              className="btn btn-primary"
              onClick={() => setVisible(true)}
            >
              Add User
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
          <div className="d-flex flex-column align-items-center">
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
                header="SR. No."
                body={(rowData, { rowIndex }) => rowIndex + 1}
              />
              <Column
                field="name"
                header="NAME"
                sortable
              />
              <Column
                field="email"
                header="EMAIL"
                sortable
              />
              <Column
                field="phone"
                header="PHONE NUMBER"
                sortable
              />
              {/* Add other columns for user properties as needed */}
              <Column
                body={(data) => (
                  <div
                    style={{
                      minWidth: "50%",
                      maxWidth: '2rem',
                      display: "flex",
                      justifyContent: "space-around",
                      alignItems: "center",
                    }}
                  >
                    <i
                      onClick={(e) => setEditData(data.username, data)}
                      className="dropdown-item-icon mdi mdi-pen text-primary me-2"
                    />
                    <i
                      onClick={(e) => deleteUser(data.username)}
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

export default Users;
