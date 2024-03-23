import React, { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "primereact/button";

import Modal from "@mui/material/Modal";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import Footer from "../../helper/Footer";
import { paymentApi } from "../../assets/apis";

import { Box } from "@mui/material";
import CreatableSelect from "react-select/creatable";
import { useSelector } from "react-redux";

const paymentMethods = [
  { label: "Cash", value: "Cash" },
  { label: "Cash Memo", value: "Memo" },
  { label: "Credit Card", value: "Credit Card" },
  { label: "Check", value: "Check" },
  { label: "Cheque", value: "Cheque" },
  { label: "Bank Transfer", value: "Bank Transfer" },
  { label: "Pay Slip", value: "Pay Slip" },
  { label: "EMI", value: "EMI" },
  { label: "Other", value: "Other" },
];

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "70vw",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Payments = () => {
  const [editState, setEditState] = useState(false);
  const [visible, setVisible] = useState(false);
  const [paymentArray, setPaymentArray] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const queryClient = useQueryClient();
  const FYState = useSelector((state) => state.FinancialYear);
  const [addPayment, setAddPayment] = useState({});

  const [searchTerm, setSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
  });

  const fetchPayments = async () => {
    const response = await axios.get(
      `${paymentApi}?page=${Number(pagination.currentPage)}&pageSize=${Number(
        pagination.pageSize
      )}&search=${searchTerm}`
    );
    setPaymentArray(response.data.payments);
    setTotalPages(response.data.totalPages || 1);
    return response.data;
  };

  const { isLoading, isError, data, refetch } = useQuery({
    queryKey: ["payment"],
    queryFn: fetchPayments,
    enabled: false,
  });

  useEffect(() => {
    refetch();
  }, [pagination, FYState]);

  useEffect(() => {
    const timer = setTimeout(refetch, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const savePayment = async () => {
    if (addPayment.amount < addPayment.pay) {
      return toast.error("You can not pay more than invoiced amount");
    } else if (!addPayment.invoice || !addPayment.date || !addPayment.pay) {
      return toast.error("Please fill all required fields");
    }
    try {
      const payload = {
        name: addPayment.name,
        invoice_no: addPayment.invoice.label,
        invoice_amount: addPayment.amount,
        paid_amount: addPayment.pay,
        method: addPayment.method.label,
        date: addPayment.date,
        note: addPayment.note,
      };
      const response = await axios.post(paymentApi, payload);

      if (response.status === 200) {
        toast.success("Payment added successfully");
        setVisible(false);
        refetch();
        fetchInv();
        setAddPayment({});
      } else {
        toast.error("Failed to add payment. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while adding payment");
    }
  };

  // const editPayment = async () => {
  //   try {
  //     const response = await axios.put(
  //       `${paymentApi}/${editState}`,
  //       addPayment
  //     );

  //     if (response.status === 200) {
  //       toast.success("Payment edited successfully");
  //       setVisible(false);
  //       refetch();
  //       setAddPayment({
  //         name: "",
  //         amount: "",
  //         description: "",
  //       });
  //       setEditState(false);
  //     } else {
  //       toast.error("Failed to edit payment. Please try again.");
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("An error occurred while editing payment");
  //   }
  // };

  // const deletePayment = async (id) => {
  //   try {
  //     const response = await axios.delete(`${paymentApi}/${id}`);

  //     if (response.status === 200) {
  //       toast.success("Payment deleted successfully");
  //       refetch();
  //     } else {
  //       toast.error("Failed to delete payment. Please try again.");
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("An error occurred while deleting payment");
  //   }
  // };

  // const setEditData = (data) => {
  //   setEditState(data.name);
  //   setAddPayment({
  //     name: data.name,
  //     amount: data.amount,
  //     description: data.description,
  //   });
  //   setVisible(true);
  // };

  const onInputChange = (value) => {
    setSearchTerm(value);
  };

  const updateAddPayment = (e, select_name) => {
    if (select_name) {
      if (select_name === "invoice") {
        console.log(e);
        let name = "";
        let amount = "";
        if (e) {
          name = e.name;
          amount = e.balance;
        }
        setAddPayment((prev) => ({
          ...prev,
          invoice: e,
          name,
          amount,
        }));
      } else {
        setAddPayment((prev) => ({
          ...prev,
          [select_name]: e,
        }));
      }
    } else {
      setAddPayment((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const fetchInv = async () => {
    try {
      const respon = await axios.get(paymentApi + "/get_inv");
      if (respon.status === 200) {
        setInvoices(
          respon.data.salesInvoices?.map((i) => ({
            ...i,
            label: i.invoice,
            value: i.invoice,
          })) || []
        );
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }
  useEffect(() => {
    fetchInv()
  }, [FYState]);

  return (
    <div className="main-panel">
      <Modal
        open={visible}
        onClose={() => {
          setVisible(false);
          setEditState(false);
          setAddPayment({
            name: "",
            amount: "",
            description: "",
          });
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        header="Add Payment"
      >
        <Box sx={style}>
          <div className="row">
            <div className="col-4 mt-2">
              <label>Invoice No *</label>
              <CreatableSelect
                //   styles={customStyles}
                name="invoice"
                className="w-100"
                value={addPayment.invoice}
                onChange={(val) => updateAddPayment(val, "invoice")}
                isClearable
                options={invoices}
              />
            </div>
            <div className="col-4 mt-2">
              <label>Client Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="name"
                name="name"
                value={addPayment.name}
                readOnly={true}
              />
            </div>

            <div className="col-4 mt-2">
              <label>Invoice Amount*</label>{" "}
              <input
                type="number"
                className="form-control"
                placeholder="Amount"
                name="amount"
                value={addPayment.amount}
                readOnly={true}
              />
            </div>
            <div className="col-4 mt-2">
              <label>Payment Method*</label>
              <CreatableSelect
                //   styles={customStyles}
                name="method"
                className="w-100"
                value={addPayment.method}
                onChange={(val) => updateAddPayment(val, "method")}
                isClearable
                options={paymentMethods}
              />
            </div>
            <div className="col-4 mt-2">
              <label>Pay*</label>{" "}
              <input
                type="number"
                className="form-control"
                placeholder="amount"
                name="pay"
                value={addPayment.pay}
                onChange={(e) => updateAddPayment(e)}
              />
            </div>
            <div className="col-4 mt-2">
              <label>Date*</label>{" "}
              <input
                type="date"
                className="form-control"
                placeholder="date"
                name="date"
                value={addPayment.date}
                onChange={(e) => updateAddPayment(e)}
              />
            </div>
            <div className="col-6 mt-2">
              <label>Note</label>{" "}
              <input
                type="text"
                className="form-control"
                placeholder="note"
                name="note"
                value={addPayment.note}
                onChange={(e) => updateAddPayment(e)}
              />
            </div>
            <div className="col-7 mt-2">
              <Button onClick={savePayment} className="btn btn-primary">
                Save
              </Button>
            </div>
          </div>
        </Box>
      </Modal>

      <div className="content-wrapper  ">
        <div id="first" className="card col-lg-12 p-3">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div className="card-title"> Payment Report</div>
            <button
              className="btn btn-primary"
              onClick={() => setVisible(true)}
            >
              Add Payment
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
              value={paymentArray}
              rowsPerPageOptions={[5, 10, 20]}
              style={{ width: "100%" }}
              className="mytable"
            >
              <Column
                className="border-bottom border-top"
                header="SR. No."
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
                field="name"
                header="Client"
                sortable
              />
              <Column
                className="border-bottom border-top"
                field="method"
                header="Method"
              />
              <Column
                className="border-bottom border-top"
                field="paid_amount"
                header="Amount"
                sortable
              />
              <Column
                className="border-bottom border-top"
                field="date"
                header="date"
                sortable
              />
              <Column
                className="border-bottom border-top"
                header="Type"
                body={(data) => data.type || "invoice"}
              />
              <Column
                className="border-bottom border-top"
                header="Note"
                body={(data) => data.note || "--"}
              />
              <Column
                className="border-bottom border-top"
                header="Financial Year"
                body={(data) => FYState.FYear.label}
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
      <Footer />
    </div>
  );
};

export default Payments;
