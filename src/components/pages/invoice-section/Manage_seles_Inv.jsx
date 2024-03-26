import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import CreatableSelect from "react-select/creatable";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { unitOfMeasurement } from "../../assets/UnitOfmeasure";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { contactApi, invoiceApi, productApi, taxApi } from "../../assets/apis";
import toast from "react-hot-toast";
import { fetchTaxes } from "../ManageTax";
import { countryList } from "../../assets/countryList";
import { fetchBrands } from "../Brand";
import { fetchCategories } from "../Category";
import { useDispatch, useSelector } from "react-redux";
import { fetchBanks } from "../Bank";
import { InvoiceActions } from "../../redux-store/index";

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
const customStyles = {
  control: (baseStyles) => ({
    ...baseStyles,
    height: "50% !important",
  }),
};
const uomArray = unitOfMeasurement.map((obj, idx) => {
  return {
    label: obj,
    value: obj,
  };
});

const ManageInv = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [bankArray, setBankArray] = useState([]);
  const InvoiceRedux = useSelector((state) => state.Invoice);
  const [editInvoiceState, setEditInvoiceState] = useState(false);
  const [invoiceData, setInvoiceData] = useState({ quantity: 1 });
  const [invoice, setInvoice] = useState([]);
  const [otherCharges, setOtherCharges] = useState({});
  const [otherInfo, setOtherInfo] = useState({});
  const [checkedCharges, setCheckedCharges] = useState({});
  const [addTaxVisible, setAddTaxVisible] = useState(false);
  const [customerData, setCustomerData] = useState({});
  const [addContactVisible, setAddContactVisible] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [addProduct, setAddProduct] = useState({});
  const [addProductVisible, setAddProductVisible] = useState(false);
  const [productArray, setProductArray] = useState([]);
  const [categoryArray, setCategoryArray] = useState([]);
  const [brandArray, setBrandArray] = useState([]);

  const [finalAmounts, setFinalAmounts] = useState({});
  const [tax, setTax] = useState([]);

  //up this new states

  const currency = "₹";

  const editorRef = useRef(null);

  const removeItem = (index) => {
    const filteredData = invoice.filter((ele, i) => i !== index);
    setInvoice(filteredData);
  };

  // my functions here
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const payload = {
      name: invoiceData.customer?.label,
      invoice: invoiceData.invoice,
      type: invoiceData.type?.label,
      amount: finalAmounts.totalAmount,
      discount: finalAmounts.discount,
      GST: finalAmounts.GST,
      date: invoiceData.date,
      total_tax: finalAmounts.totalTax,
      total: finalAmounts.grandTotal,
      paid_amount: otherCharges.advance,
      date: invoiceData.date,
      balance: +finalAmounts.grandTotal - (+otherCharges.advance || 0),
      all_products: invoice,
      other_charges: otherCharges,
      other_info: otherInfo,
      all_checks: checkedCharges,
    };
    try {
      const response = await axios.post(invoiceApi, payload);
      toast.success("invoice successfully submitted");
      navigate("/sales_invoice");
    } catch (error) {
      if (error.response?.data?.message)
        return toast.error(error.response?.data?.message);
      else return toast.error("something went wrong ");
    }
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    const payload = {
      name: invoiceData.customer?.label,
      invoice: invoiceData.invoice,
      type: invoiceData.type?.label,
      amount: finalAmounts.totalAmount,
      discount: finalAmounts.discount,
      GST: finalAmounts.GST,
      date: invoiceData.date,
      total_tax: finalAmounts.totalTax,
      total: finalAmounts.grandTotal,
      paid_amount: otherCharges.advance,
      balance: +finalAmounts.grandTotal - (+otherCharges.advance || 0),
      all_products: invoice,
      other_charges: otherCharges,
      other_info: otherInfo,
      all_checks: checkedCharges,
    };
    try {
      const response = await axios.put(
        `${invoiceApi}/${editInvoiceState}`,
        payload
      );
      toast.success("invoice successfully Edited");
      navigate("/sales_invoice");
    } catch (error) {
      if (error.response?.data?.message)
        return toast.error(error.response?.data?.message);
      else return toast.error("something went wrong ");
    }
  };

  const updateInvoiceData = (e, selectName) => {
    if (selectName) {
      if (selectName === "customer") {
        let address = "";
        if (e) {
          address =
            (e?.billing_address || e?.billing_city || e?.billing_state || "") +
            " " +
            e?.billing_country;
        }
        setInvoiceData((prev) => {
          return {
            ...prev,
            [selectName]: e,
            shipping_address: { ...e, label: address, value: address },
          };
        });
      }
      setInvoiceData((prev) => {
        return { ...prev, [selectName]: e };
      });
    } else {
      const name = e.target.name;
      const value = e.target.value;

      setInvoiceData((prev) => {
        return { ...prev, [name]: value };
      });
    }
  };
  const updateOtherInfo = (e, selectName) => {
    if (selectName) {
      const name = selectName;
      const value = e;
      setOtherInfo((prev) => ({ ...prev, [name]: value }));
    } else {
      const name = e.target.name;
      const value = e.target.value;

      setOtherInfo((prev) => ({ ...prev, [name]: value }));
    }
  };

  const updateOtherCharges = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setOtherCharges((prev) => ({ ...prev, [name]: value }));
  };
  const updateCheckBox = (e) => {
    setCheckedCharges((prev) => ({
      ...prev,
      [e.target.name]: e.target.checked,
    }));
    if (!e.target.checked) {
      const name = e.target.name;
      setOtherCharges((prev) => ({ ...prev, [name]: 0 }));
    }
  };
  //tax logic
  const {
    isTaxLoading,
    isTaxError,
    data: taxData,
    TaxError,
  } = useQuery({
    queryKey: ["tax"],
    queryFn: fetchTaxes,
  });
  useEffect(() => {
    if (taxData?.taxes) {
      const temp = taxData?.taxes.map((cat) => {
        return { ...cat, value: cat.name, label: cat.name };
      });
      setTax(temp);
    }
  }, [taxData]);
  const createTaxApiCallHandler = async () => {
    if (!tax.name || !tax.rate)
      return toast.error("Please provide Tax Name and Rate");
    try {
      await axios.post(taxApi, tax);
      toast.success("Tax added successfully");
      queryClient.invalidateQueries("tax");
      setTax({
        name: "",
        rate: "",
      });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const addInvoice = async (e) => {
    e.preventDefault();
    try {
      if (invoice.length === 0) {
        const response = await axios.get(
          `${invoiceApi}/check_inv?inv=${invoiceData.invoice}`
        );
        if (!response.data.success) {
          toast.error("this invoice No. is not available");
          return;
        }
      }
      const response = await axios.get(
        `${invoiceApi}/check_quantity?quantity=${invoiceData.quantity}&prod_id=${invoiceData.product.id}`
      );
      if (!response.data.success) {
        toast.error("this much quantity is not available");
        return;
      }
    } catch (error) {}
    setInvoice([...invoice, invoiceData]);

    setInvoiceData((prev) => {
      return {
        ...prev,
        quantity: 1,
        uom: "",
        tax: "",
        hsn_sac: "",
        discount: 0,
        price: "",
        product: "",
      };
    });
  };

  useEffect(() => {
    const fetchInvNo = async () => {
      try {
        const response = await axios.get(invoiceApi + "/get_inv");
        if (response.data.success) {
          setInvoiceData({ invoice: response.data.invoice, quantity: 1 });
        }
      } catch (error) {}
    };
    if (InvoiceRedux.SalesInvoiceData) {
      setInvoice(JSON.parse(InvoiceRedux.SalesInvoiceData.all_products));
      setCheckedCharges(JSON.parse(InvoiceRedux.SalesInvoiceData.all_checks));
      setOtherInfo(JSON.parse(InvoiceRedux.SalesInvoiceData.other_info));
      setOtherCharges(JSON.parse(InvoiceRedux.SalesInvoiceData.other_charges));
      setInvoiceData({
        customer: {
          label: InvoiceRedux.SalesInvoiceData.name,
          value: InvoiceRedux.SalesInvoiceData.name,
        },
        type: {
          label: InvoiceRedux.SalesInvoiceData.type,
          value: InvoiceRedux.SalesInvoiceData.type,
        },
        invoice: InvoiceRedux.SalesInvoiceData.invoice,
        date: InvoiceRedux.SalesInvoiceData.date,
      });
      setEditInvoiceState(InvoiceRedux.SalesInvoiceData.id);
      dispatch(InvoiceActions.editSalesInvoice(null));
    } else {
      fetchInvNo();
    }
  }, []);
  useEffect(() => {
    let amount = 0;
    let gst = 0;
    let totalTax = 0;
    let discount = 0;
    invoice.forEach((item) => {
      let tempAmount =
        Number(item.quantity) * Number(item.price - (item.discount || 0)) || 0;
      let tempAmount1 =
        tempAmount - (Number(otherCharges.discount || 0) * tempAmount) / 100;
      amount = amount + tempAmount1;
      let tempGstPerc = item.tax?.label?.toUpperCase().includes("GST")
        ? +item.tax?.rate
        : +0;
      let tempDiscount =
        +item.discount * +item.quantity +
        (Number(otherCharges.discount || 0) * tempAmount) / 100;
      discount = discount + tempDiscount;
      if (!tempGstPerc) {
        let tempOtherTax = +item.tax?.rate || 0;
        totalTax = +totalTax + (+tempAmount * +tempOtherTax) / 100;
      } else {
        totalTax = +totalTax + (+tempAmount * +tempGstPerc) / 100;
        gst = gst + (+tempAmount * +tempGstPerc) / 100;
      }
    });

    setFinalAmounts({
      totalAmount: amount,
      GST: gst,
      totalTax,
      discount,
      grandTotal:
        +amount +
        +totalTax +
        (+otherCharges.shipping_charges || 0) +
        (+otherCharges.transport || 0),
    });
  }, [otherCharges, invoice]);
  //contact logic
  const updateCustomerData = (e, select_name) => {
    if (select_name) {
      return setCustomerData((prev) => {
        return {
          ...prev,
          [select_name]: e,
        };
      });
    } else {
      return setCustomerData((prev) => {
        return {
          ...prev,
          [e.target.name]: e.target.value,
        };
      });
    }
  };
  const saveContact = async () => {
    try {
      const contact = {
        ...customerData,
        contactType: "customer",
        billing_country: customerData.billing_country?.value,
      };
      const response = await axios.post(contactApi, contact);

      toast.success("Contact added successfully");
      queryClient.invalidateQueries("contacts");
      resetFormAndHideModal();
    } catch (error) {
      handleApiError(error);
    }
  };
  const fetchContacts = async () => {
    try {
      const response = await axios.get(`${contactApi}`);
      setContacts(
        response.data.contacts
          .filter((i) => i.contactType === "customer")
          .map((item) => ({
            ...item,
            label: item.name,
            value: item.name,
          }))
      );
      return response.data;
    } catch (error) {
      console.error(error);

      handleApiError(error);
    }
  };
  const {
    isLoading,
    isError,
    data: contactData,
    error,
  } = useQuery({
    queryKey: ["contacts"],
    queryFn: fetchContacts,
  });

  const resetFormAndHideModal = () => {
    setAddContactVisible(false);
    setCustomerData({});
  };

  const handleApiError = (error) => {
    const errorMessage = error.response?.data?.message || "An error occurred";
    toast.error(errorMessage);
  };

  // product section
  const fetchProducts = async () => {
    const response = await axios.get(`${productApi}`);
    const { products } = response.data;
    setProductArray(
      products.map((item) => ({
        ...item,
        label: item.name,
        value: item.name,
      }))
    );
    return response.data;
  };
  const {
    isProductLoading,
    isProductError,
    data: pData,
    productError,
  } = useQuery({
    queryKey: ["product"],
    queryFn: fetchProducts,
  });
  const updateAddProduct = (e, selectName) => {
    if (selectName) {
      return setAddProduct((prev) => {
        return {
          ...prev,
          [selectName]: e,
        };
      });
    } else {
      const name = e.target.name;
      const value = e.target.value;

      return setAddProduct((prev) => {
        return {
          ...prev,
          [name]: value,
        };
      });
    }
  };
  const createProductAPICallHandler = async () => {
    const loading = toast.loading("Creating Product...");
    const payload = {
      ...addProduct,
      brandName: addProduct?.brand?.value,
      categoryName: addProduct?.category?.value,
      type: addProduct?.type?.value,
      taxName: addProduct?.tax?.value,
    };
    try {
      const response = await axios.post(productApi, payload);
      toast.success("Product was successfully submitted");
      queryClient.invalidateQueries("product");
      setAddProduct({});
      setAddProductVisible(false);
    } catch (error) {
      toast.dismiss(loading);
      if (error.response?.data?.message)
        return toast.error(error.response?.data?.message);
      else return toast.error("something went wrong ");
    }
    toast.dismiss(loading);
  };

  // brand logic
  const {
    isBrandLoading,
    isBrandError,
    data: brandData,
    brandeError,
  } = useQuery({
    queryKey: ["brand"],
    queryFn: fetchBrands,
  });
  useEffect(() => {
    if (brandData?.brands) {
      const temp = brandData.brands.map((cat) => {
        return { ...cat, value: cat.name, label: cat.name };
      });
      setBrandArray(temp);
    }
  }, [brandData]);

  // category logic
  const { data: categoryData } = useQuery({
    queryKey: ["category"],
    queryFn: fetchCategories,
  });
  useEffect(() => {
    if (categoryData?.categories) {
      const temp = categoryData.categories.map((cat) => {
        return { ...cat, value: cat.name, label: cat.name };
      });
      setCategoryArray(temp);
    }
  }, [categoryData]);

  // bank section
  const { data: bankData } = useQuery({
    queryKey: ["bank"],
    queryFn: fetchBanks,
  });

  useEffect(() => {
    if (bankData?.banks) {
      setBankArray(
        bankData.banks.map((item) => ({
          ...item,
          label: item.name,
          value: item.name,
        }))
      );
    }
  }, [bankData]);

  return (
    <div className={`main-panel`}>
      <div className="content-wrapper">
        <Modal
          open={addContactVisible}
          onClose={() => {
            setAddContactVisible(false);
            setCustomerData({});
          }}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "80%",
                bgcolor: "background.paper",
                border: "2px solid #000",
                boxShadow: 24,
                p: 4,
              }}
              className="row card d-flex flex-row rounded rounded-2"
            >
              <div className="col-12 ">
                <h5>CONTACT INFORMATION</h5>
              </div>
              <div className="row">
                <div className="col-md-3">
                  <div className="form-group">
                    <label>Customer Name *</label>
                    <input
                      required
                      value={customerData.name}
                      onChange={updateCustomerData}
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
                      value={customerData.display_name}
                      onChange={updateCustomerData}
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
                      value={customerData.phone}
                      onChange={updateCustomerData}
                      name="phone"
                      type="text"
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      required
                      value={customerData.email}
                      onChange={updateCustomerData}
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
                      value={customerData.GSTIN}
                      onChange={updateCustomerData}
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
                      value={customerData.TIN}
                      onChange={updateCustomerData}
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
                      value={customerData.PAN}
                      onChange={updateCustomerData}
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
                      value={customerData.VAT}
                      onChange={updateCustomerData}
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
                      value={customerData.DL}
                      onChange={updateCustomerData}
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
                      value={customerData.billing_address}
                      onChange={updateCustomerData}
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
                      //   styles={customStyles}
                      name="billing_country"
                      className="w-100"
                      value={customerData.billing_country}
                      onChange={(val) =>
                        updateCustomerData(val, "billing_country")
                      }
                      isClearable
                      options={countryList.map((i) => ({ label: i, value: i }))}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label>Billing State</label>
                    <input
                      required
                      value={customerData.billing_state}
                      onChange={updateCustomerData}
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
                      value={customerData.billing_city}
                      onChange={updateCustomerData}
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
                      value={customerData.billing_PIN_Code}
                      onChange={updateCustomerData}
                      name="billing_PIN_Code"
                      type="text"
                      className="form-control"
                    />
                  </div>
                </div>

                <button
                  onClick={saveContact}
                  className="btn btn-primary d-flex justify-content-center"
                >
                  {" "}
                  <i className="mdi mdi-content-save me-1"></i> Save
                </button>
              </div>
            </Box>
          </>
        </Modal>
        {/* Product Modal here */}
        <Modal
          open={addProductVisible}
          onClose={() => {
            setAddProductVisible(false);
          }}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "80%",
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
            }}
            className="row card d-flex flex-row rounded rounded-2"
          >
            <div className="row p-2">
              <div className="d-flex mt-2 mb-2  justify-content-start">
                <h2> Add Product </h2>
              </div>
              <div className="d-flex mt-2 mb-2 justify-content-start">
                <h5>PRODUCT/SERVICE INFORMATION</h5>
              </div>

              <div className="col-12">
                <div className="row">
                  <div className="col-lg-3 col-md-3 col-sm-6 mb-2">
                    <label htmlFor="name " className="w-100  mb-2">
                      Product Name*
                    </label>
                    <input
                      value={addProduct.name}
                      onChange={updateAddProduct}
                      type="text"
                      className="form-control w-100"
                      placeholder="Product Name*"
                      name="name"
                    />
                  </div>
                  <div className="col-lg-3 col-md-3 col-sm-6 mb-2">
                    <label htmlFor="p-name " className="w-100  mb-2">
                      Product Varient
                    </label>
                    <input
                      value={addProduct.varient}
                      onChange={updateAddProduct}
                      type="text"
                      className="form-control w-100"
                      placeholder="Product Varient"
                      name="varient"
                    />
                  </div>
                  <div className="col-lg-3 col-md-3 col-sm-6 mb-2">
                    <label
                      htmlFor="p-name "
                      className="w-100 d-flex justify-content-start align-items-center  mb-2"
                    >
                      Category{" "}
                    </label>

                    <CreatableSelect
                      styles={customStyles}
                      name="category"
                      className="w-100"
                      value={addProduct.category}
                      onChange={(val) => updateAddProduct(val, "category")}
                      isClearable
                      options={categoryArray}
                    />
                  </div>
                  <div className="col-lg-3 col-md-3 col-sm-6 mb-2">
                    <label
                      htmlFor="p-name "
                      className="w-100 d-flex justify-content-start align-items-center  mb-2"
                    >
                      Brand{" "}
                    </label>
                    <CreatableSelect
                      styles={customStyles}
                      name="brand"
                      className="w-100"
                      value={addProduct.brand}
                      onChange={(val) => updateAddProduct(val, "brand")}
                      isClearable
                      options={brandArray}
                    />
                  </div>
                  <div className="col-lg-3 col-md-3 col-sm-6 mb-2">
                    <label
                      htmlFor="p-name "
                      className="w-100 d-flex justify-content-start align-items-center  mb-2"
                    >
                      Type{" "}
                    </label>
                    <CreatableSelect
                      styles={customStyles}
                      name="type"
                      className="w-100"
                      value={addProduct.type}
                      onChange={(val) => updateAddProduct(val, "type")}
                      isClearable
                      options={[
                        { label: "product", value: "product" },
                        { label: "service", value: "service" },
                      ]}
                    />
                  </div>

                  <div className="col-lg-3 col-md-3 col-sm-6 mb-2">
                    <label htmlFor="p-name " className="w-100  mb-2">
                      HSN/SAC Code
                    </label>
                    <input
                      type="text"
                      value={addProduct.hsn_code}
                      onChange={updateAddProduct}
                      className="form-control w-100"
                      placeholder="HSN Code"
                      name="hsn_code"
                    />
                  </div>
                  <div className="col-lg-3 col-md-3 col-sm-6 mb-2">
                    <label
                      htmlFor="p-name "
                      className="w-100 d-flex justify-content-start align-items-center  mb-2"
                    >
                      Tax{" "}
                    </label>
                    <CreatableSelect
                      styles={customStyles}
                      name="type"
                      className="w-100"
                      value={addProduct.tax}
                      onChange={(val) => updateAddProduct(val, "tax")}
                      isClearable
                      options={tax}
                    />
                  </div>

                  <div className="col-lg-3 col-md-3 col-sm-6 mb-2">
                    <label htmlFor="p-name " className="w-100  mb-2">
                      MRP Price
                    </label>
                    <input
                      type="text"
                      className="form-control w-100"
                      placeholder="MRP Price"
                      name="mrp_price"
                      value={addProduct.mrp_price}
                      onChange={updateAddProduct}
                    />
                  </div>
                  <div className="col-lg-3 col-md-3 col-sm-6 mb-2">
                    <label htmlFor="p-name " className="w-100  mb-2">
                      S. Price(Net)
                    </label>
                    <input
                      value={addProduct.s_price}
                      onChange={updateAddProduct}
                      type="text"
                      className="form-control w-100"
                      placeholder="S. Price*(Net)"
                      name="s_price"
                    />
                  </div>
                  <div className="col-lg-3 col-md-3 col-sm-6 mb-2">
                    <label htmlFor="p-name " className="w-100  mb-2">
                      P. Price
                    </label>
                    <input
                      value={addProduct.p_price}
                      onChange={updateAddProduct}
                      type="text"
                      className="form-control w-100"
                      placeholder="P. Price*"
                      name="p_price"
                    />
                  </div>
                  <div className="col-lg-3 col-md-3 col-sm-6 mb-2">
                    <label htmlFor="p-name " className="w-100  mb-2">
                      UoM
                    </label>
                    <input
                      type="text"
                      className="form-control w-100"
                      placeholder="UoM"
                      name="UOM"
                      value={addProduct.UOM}
                      onChange={updateAddProduct}
                    />
                  </div>
                  <div className="col-lg-3 col-md-3 col-sm-6 mb-2">
                    <label htmlFor="p-name " className="w-100  mb-2">
                      Opening Qty per
                    </label>
                    <input
                      type="text"
                      className="form-control w-100"
                      placeholder="Opening Qty per"
                      name="opening_qty_per"
                      value={addProduct.opening_qty_per}
                      onChange={updateAddProduct}
                    />
                  </div>
                  <div className="col-lg-12 col-md-12 col-sm-12 mb-2">
                    <label htmlFor="p-name " className="w-100  mb-2">
                      Description
                    </label>
                    <textarea
                      style={{
                        height: "auto",
                        minHeight: "100px", // Adjust this value based on your requirement
                      }}
                      className="form-control w-100"
                      placeholder="Description"
                      name="description"
                      value={addProduct.description}
                      onChange={updateAddProduct}
                    />
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={createProductAPICallHandler}
              className="btn btn-primary d-flex justify-content-center"
            >
              {" "}
              <i className="mdi mdi-content-save me-1"></i> Save
            </button>
          </Box>
        </Modal>

        <Modal
          open={addTaxVisible}
          onClose={(e) => setAddTaxVisible(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          header="Add Category"
          className="col-sm-12"
        >
          <Box sx={style}>
            <h4>Add Tax</h4>
            <div className="d-flex flex-row align-items-center mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Tax Name"
                name="name"
                value={tax.name}
                onChange={(e) =>
                  setTax((prev) => {
                    return { ...prev, name: e.target.value };
                  })
                }
                readOnly={false}
              />
            </div>
            <div className="d-flex flex-row align-items-center ">
              <input
                type="number"
                className="form-control"
                placeholder="Tax Rate"
                name="rate"
                value={tax.rate}
                onChange={(e) =>
                  setTax((prev) => {
                    return { ...prev, rate: e.target.value };
                  })
                }
                readOnly={false}
              />
            </div>
            <div className="d-flex">
              <Button
                onClick={createTaxApiCallHandler}
                style={{
                  height: "1.9rem",
                  width: "2.7rem",
                  borderRadius: "5px",
                  margin: "4px",
                  backgroundColor: "blue",
                  color: "white",
                }}
              >
                Save
              </Button>
            </div>
          </Box>
        </Modal>

        <div className="row">
          <div className="col-sm-12">
            <div className="d-flex justify-content-between m-1 p-1 align-items-baseline ">
              <h3 className="ukhd mb-3">
                {" "}
                {editInvoiceState ? "Edit" : "Add"} Sales Invoice{" "}
              </h3>
              <button
                type="button"
                class="btn btn-warning btn-sm"
                onClick={() => navigate("/sales_invoice")}
              >
                <div className="d-flex justify-content-center">
                  <i class="mdi mdi mdi-keyboard-backspace"></i>
                  <span>Back</span>
                </div>
              </button>
            </div>

            <div className="row flex-grow">
              <div className="col-12 grid-margin stretch-card">
                <div className="card card-rounded">
                  <div className="card-body">
                    <form
                      className="row"
                      onKeyPress={(event) => (event.key === "Enter" ? "" : "")}
                    >
                      <div className="col-3">
                        <div className="form-group">
                          <div className="select-container ">
                            <label className="col-12 ">
                              {" "}
                              Customer
                              <i
                                className="mdi mdi-plus text-success fw-bold h4"
                                data-toggle="modal"
                                onClick={() => setAddContactVisible(true)}
                              ></i>
                            </label>
                            <CreatableSelect
                              // styles={customStyles}
                              name="customer"
                              className="w-100"
                              value={invoiceData.customer}
                              onChange={(val) =>
                                updateInvoiceData(val, "customer")
                              }
                              isClearable
                              options={contacts}
                              isDisabled={invoice?.length > 0}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-3">
                        <div className="form-group">
                          <div className="select-container ">
                            <label className="col-12 "> Type</label>
                            <CreatableSelect
                              // styles={customStyles}
                              name="type"
                              className="w-100"
                              placeholder="Select Type"
                              value={invoiceData.type}
                              onChange={(val) => updateInvoiceData(val, "type")}
                              isClearable
                              options={[
                                { label: "Goods", value: "Goods" },
                                { label: "Serivce", value: "Service" },
                              ]}
                              isDisabled={invoice?.length > 0}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-3">
                        <div className="form-group">
                          <label>Date</label>
                          <input
                            type="date"
                            className="form-control form-control-alternative"
                            name="date"
                            value={invoiceData.date}
                            onChange={updateInvoiceData}
                          />
                        </div>
                      </div>

                      <div className="col-3">
                        <div className="form-group">
                          <label> Due Date </label>
                          <input
                            type="date"
                            className="form-control form-control-alternative"
                            name="dueDate"
                            value={invoiceData.dueDate}
                            onChange={updateInvoiceData}
                          />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="form-group">
                          <div className="select-container ">
                            <label className="col-12 "> Shipping Address</label>
                            <CreatableSelect
                              // styles={customStyles}
                              name="shipping_address"
                              className="w-100"
                              placeholder="Select Address"
                              value={invoiceData.shipping_address}
                              onChange={(val) =>
                                updateInvoiceData(val, "shipping_address")
                              }
                              options={[]}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-3">
                        <div className="form-group">
                          <label>Invoice No.</label>
                          <div className="input-group">
                            <input
                              type="text"
                              className="form-control form-control-alternative"
                              placeholder="Invoice No."
                              name="invoice"
                              value={invoiceData.invoice}
                              onChange={updateInvoiceData}
                              readOnly={invoice.length > 0}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-3">
                        <div className="form-group">
                          <label> HSN/SAC Code </label>
                          <div className="input-group">
                            <input
                              type="number"
                              className="form-control form-control-alternative"
                              placeholder="HSN/SAC Code"
                              name="hsn_sac"
                              value={invoiceData.hsn_sac}
                              onChange={updateInvoiceData}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-3">
                        <div className="form-group">
                          <label> Quantity </label>
                          <div className="input-group">
                            <input
                              type="number"
                              className="form-control form-control-alternative"
                              placeholder="Quantity"
                              name="quantity"
                              min={1}
                              value={invoiceData.quantity}
                              onChange={updateInvoiceData}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-3">
                        <div className="form-group">
                          <label> Unit Price </label>
                          <div className="input-group">
                            <input
                              type="number"
                              className="form-control form-control-alternative"
                              placeholder="Unit Price"
                              name="price"
                              value={invoiceData.price}
                              onChange={updateInvoiceData}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-3">
                        <div className="form-group">
                          <label> Discount </label>
                          <div className="input-group">
                            <input
                              type="number"
                              className="form-control form-control-alternative"
                              placeholder="Discount"
                              name="discount"
                              value={invoiceData.discount}
                              onChange={updateInvoiceData}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-3">
                        <div className="form-group">
                          <div className="select-container ">
                            <label className="col-12 "> UoM</label>
                            <CreatableSelect
                              // styles={customStyles}
                              name="uom"
                              className="w-100"
                              placeholder="Select UoM"
                              value={invoiceData?.uom}
                              onChange={(val) => updateInvoiceData(val, "uom")}
                              isClearable
                              options={uomArray}
                            />
                            <label>UoM = Unit of Measurement</label>
                          </div>
                        </div>
                      </div>
                      <div className="col-3">
                        <div className="form-group">
                          <div className="select-container ">
                            <label
                              htmlFor="p-name "
                              className="w-100 d-flex justify-content-start align-items-center  mb-2"
                            >
                              Product/Service{" "}
                              <span className="" style={{ cursor: "pointer" }}>
                                <i
                                  onClick={() => setAddProductVisible(true)}
                                  className="mdi text-success  fw-bold mdi-plus"
                                />
                              </span>{" "}
                            </label>
                            <CreatableSelect
                              // styles={customStyles}
                              name="type"
                              className="w-100"
                              value={invoiceData.product}
                              onChange={(val) =>
                                updateInvoiceData(val, "product")
                              }
                              isClearable
                              options={productArray}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-3">
                        <div className="form-group">
                          <div className="select-container ">
                            <label
                              htmlFor="p-name "
                              className="w-100 d-flex justify-content-start align-items-center  mb-2"
                            >
                              Tax{" "}
                              <span className="" style={{ cursor: "pointer" }}>
                                <i
                                  onClick={() => setAddTaxVisible(true)}
                                  className="mdi text-success  fw-bold mdi-plus"
                                />
                              </span>{" "}
                            </label>
                            <CreatableSelect
                              // styles={customStyles}
                              name="type"
                              className="w-100"
                              value={invoiceData.tax}
                              onChange={(val) => updateInvoiceData(val, "tax")}
                              isClearable
                              options={tax}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-12 mb-2">
                        <div className="col-3">
                          <button
                            type="submit"
                            className="btn btn-primary me-2"
                            onClick={(e) => {
                              addInvoice(e);
                            }}
                            disabled={
                              invoiceData.quantity < 1 ||
                              !invoiceData.invoice ||
                              !invoiceData.product ||
                              invoiceData.price < 1
                            }
                          >
                            <div className="d-flex justify-content-center">
                              {" "}
                              <i className="mdi mdi-plus fw-bold"></i> Add
                            </div>
                          </button>
                        </div>
                      </div>
                    </form>
                    <div className="table-responsive table-alone mt-1 ">
                      <table className="table select-table ">
                        <thead>
                          <tr>
                            <th>S.No.</th>
                            <th> Product/Service</th>
                            <th> Quantity</th>
                            <th>Hsn/SAC Code</th>
                            <th> Net Price</th>
                            <th>Discount</th>
                            <th>Amount</th>
                            <th>Tax</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        {!invoice.length ? (
                          <tr>
                            <td colSpan="7" className="text-center">
                              No data found
                            </td>
                          </tr>
                        ) : (
                          invoice?.map((item, i) => {
                            const code = item.hsn_sac;
                            const name = item.product?.value;
                            const type = item.type?.value;
                            const tax = item.tax?.rate || 0;
                            let amount =
                              Number(item.quantity) *
                                Number(item.price - (item.discount || 0)) || 0;
                            amount =
                              amount -
                              (Number(otherCharges.discount || 0) * amount) /
                                100;

                            return (
                              <>
                                <tbody className="border-table-row ">
                                  <tr key={i}>
                                    <td>
                                      <h6 className="text-dark font-weight">
                                        {i + 1}
                                      </h6>
                                    </td>
                                    <td>
                                      <h5 className="text-dark font-weight">
                                        {name}
                                      </h5>
                                      <span
                                        className={`table-color-col ${
                                          item.type
                                            ? "bg-success"
                                            : "bg-warning"
                                        } text-light font-weight`}
                                      >
                                        {type}
                                      </span>
                                    </td>
                                    <td>
                                      <h6>{item.quantity}</h6>
                                    </td>
                                    <td>
                                      <h6>{code}</h6>
                                    </td>
                                    <td>
                                      <h6>
                                        {currency}
                                        {item.price}
                                      </h6>
                                    </td>
                                    <td>
                                      <h6>{item.discount}</h6>
                                    </td>
                                    <td>
                                      <h6>
                                        {currency}
                                        {amount}
                                      </h6>
                                    </td>
                                    <td>
                                      <h6>{tax}%</h6>
                                    </td>
                                    <td>
                                      <div className="">
                                        <i
                                          class="fs-20 mdi mdi-archive text-danger"
                                          onClick={() => {
                                            removeItem(i);
                                          }}
                                        ></i>
                                      </div>
                                    </td>
                                  </tr>
                                </tbody>
                              </>
                            );
                          })
                        )}
                      </table>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-md-8">
                        <h6 className="heading-small text-muted mb-4">
                          Other Charges
                        </h6>
                        <div className="row">
                          <div className="col-lg">
                            <div className="form-group">
                              <input
                                type="checkbox"
                                className="is_checked"
                                defaultValue="shipping_charge"
                                name="shipping_charges"
                                onChange={updateCheckBox}
                              />{" "}
                              <span className="other-charge-font">
                                Shipping Charges
                              </span>
                            </div>
                          </div>
                          <div className="col-lg">
                            <div className="form-group focused">
                              {checkedCharges.shipping_charges && (
                                <input
                                  type="number"
                                  onChange={updateOtherCharges}
                                  defaultValue={0}
                                  min={0}
                                  max={9999}
                                  value={otherCharges.shipping_charges}
                                  style={{}}
                                  className="form-control form-control-alternative extra-charge"
                                  name="shipping_charges"
                                />
                              )}
                            </div>
                          </div>
                          <div className="col-lg">
                            <div className="form-group">
                              <input
                                type="checkbox"
                                className="is_checked"
                                defaultValue="e_commerce_gst"
                                name="e_commerce_gst"
                                onChange={updateCheckBox}
                              />{" "}
                              <span className="other-charge-font">
                                E Commerce GST
                              </span>
                            </div>
                          </div>
                          <div className="col-lg">
                            <div className="form-group">
                              {checkedCharges.e_commerce_gst && (
                                <input
                                  type="text"
                                  id="e_commerce_gst"
                                  style={{}}
                                  className="form-control form-control-alternative extra-charge"
                                  name="e_commerce_gst_value"
                                  onChange={updateOtherCharges}
                                  value={otherCharges.e_commerce_gst_value}
                                />
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-lg">
                            <div className="form-group">
                              <input
                                type="checkbox"
                                className="is_checked"
                                name="discount"
                                onChange={updateCheckBox}
                              />{" "}
                              <span className="other-charge-font">
                                Total Discount(%)
                              </span>
                            </div>
                          </div>
                          <div className="col-lg">
                            <div className="form-group focused">
                              {checkedCharges.discount && (
                                <input
                                  type="number"
                                  defaultValue={0}
                                  style={{}}
                                  name="discount"
                                  onChange={updateOtherCharges}
                                  min={0}
                                  value={otherCharges.discount}
                                  className="form-control form-control-alternative extra-charge"
                                />
                              )}
                            </div>
                          </div>
                          <div className="col-lg">
                            <div className="form-group">
                              <input
                                type="checkbox"
                                className="is_checked"
                                name="transport"
                                defaultValue="transport"
                                onChange={updateCheckBox}
                              />
                              <span className="other-charge-font">
                                {" "}
                                Transport
                              </span>
                            </div>
                          </div>
                          <div className="col-lg">
                            <div className="form-group">
                              {checkedCharges.transport && (
                                <input
                                  type="text"
                                  id="transport"
                                  name="transport"
                                  className="form-control form-control-alternative extra-charge"
                                  onChange={updateOtherCharges}
                                  value={otherCharges.transport}
                                />
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-lg">
                            <div className="form-group">
                              <input
                                type="checkbox"
                                className="is_checked"
                                name="round_off"
                                onChange={updateCheckBox}
                              />{" "}
                              <span className="other-charge-font">
                                Round Off
                              </span>
                            </div>
                          </div>
                          <div className="col-lg">
                            <div className="form-group focused">
                              {checkedCharges.round_off && (
                                <input
                                  type="number"
                                  id="round_off"
                                  readOnly
                                  onChange={updateOtherCharges}
                                  className="form-control form-control-alternative extra-charge"
                                  name="round_off_value"
                                />
                              )}
                            </div>
                          </div>

                          <div className="col-lg">
                            <div className="form-group">
                              <input
                                type="checkbox"
                                className="is_checked"
                                defaultValue="vehicle_no"
                                name="vehicle"
                                onChange={updateCheckBox}
                              />{" "}
                              <span className="other-charge-font">
                                {" "}
                                Vehicle No.
                              </span>
                            </div>
                          </div>
                          <div className="col-lg">
                            <div className="form-group">
                              {checkedCharges.vehicle && (
                                <input
                                  type="text"
                                  className="form-control form-control-alternative extra-charge"
                                  name="vehicle"
                                  onChange={updateOtherCharges}
                                  value={otherCharges.vehicle}
                                />
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-lg">
                            <div className="form-group">
                              <input
                                type="checkbox"
                                className="is_checked"
                                defaultValue="advance_paid"
                                name="advance_paid"
                                onChange={updateCheckBox}
                              />{" "}
                              <span className="other-charge-font">
                                {" "}
                                Advance Paid
                              </span>
                            </div>
                          </div>
                          <div className="col-lg">
                            <div className="form-group focused">
                              {checkedCharges.advance_paid && (
                                <input
                                  type="number"
                                  id="advance"
                                  name="advance"
                                  onChange={updateOtherCharges}
                                  min={0}
                                  value={otherCharges.advance}
                                  className="form-control form-control-alternative extra-charge"
                                />
                              )}
                            </div>
                          </div>
                          <div className="col-lg">
                            <div className="form-group">
                              <input
                                type="checkbox"
                                className="is_checked"
                                defaultValue="lr_no"
                                name="lr_no"
                                onChange={updateCheckBox}
                              />{" "}
                              <span className="other-charge-font">
                                {" "}
                                L.R. No.
                              </span>
                            </div>
                          </div>
                          <div className="col-lg">
                            <div className="form-group">
                              {checkedCharges.lr_no && (
                                <input
                                  type="text"
                                  className="form-control form-control-alternative extra-charge"
                                  name="lrno"
                                  onChange={updateOtherCharges}
                                  value={otherCharges.lr_no}
                                />
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-lg">
                            <div className="form-group">
                              <input
                                type="checkbox"
                                className="is_checked"
                                name="sbp_code"
                                onChange={updateCheckBox}
                              />{" "}
                              <span className="other-charge-font">
                                {" "}
                                Sbp Code
                              </span>
                            </div>
                          </div>
                          <div className="col-lg">
                            <div className="form-group">
                              {checkedCharges.sbp_code && (
                                <input
                                  type="text"
                                  id="sbp_code"
                                  className="form-control form-control-alternative extra-charge"
                                  name="sbp_code"
                                  onChange={updateOtherCharges}
                                  value={otherCharges.sbp_code}
                                />
                              )}
                            </div>
                          </div>
                          <div className="col-lg">
                            <div className="form-group">
                              <input
                                type="checkbox"
                                className="is_checked"
                                defaultValue="challan"
                                name="challan"
                                onChange={updateCheckBox}
                              />{" "}
                              <span className="other-charge-font">
                                {" "}
                                Challan No.
                              </span>
                            </div>
                          </div>
                          <div className="col-lg">
                            <div className="form-group">
                              {checkedCharges.challan && (
                                <input
                                  type="text"
                                  className="form-control form-control-alternative extra-charge"
                                  name="challan"
                                  onChange={updateOtherCharges}
                                  value={otherCharges.challan}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Final Amount Table */}
                      <div className="col-md-4">
                        <div className="row w-100">
                          <div className="col">
                            <div className="card shadow">
                              <input
                                type="hidden"
                                id="total_discount_column"
                                defaultValue={0}
                                name="overall_discount"
                              />
                              <div className="table-responsive">
                                <table
                                  id="amount_table"
                                  className="table align-items-center table"
                                >
                                  <thead className="thead-light">
                                    <tr>
                                      <th scope="col">Details</th>
                                      <th scope="col">Amount</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <th scope="row">Sub-total</th>
                                      <td id="sub_total_column">
                                        <input
                                          type="hidden"
                                          defaultValue={0}
                                          name="subtotal"
                                        />{" "}
                                        ₹ {finalAmounts.totalAmount}{" "}
                                      </td>
                                    </tr>
                                    <tr
                                      id="cgst_row"
                                      style={{ display: "table-row" }}
                                    >
                                      <th scope="row">GST</th>
                                      <td id="gst_column">
                                        ₹ {finalAmounts.GST}
                                      </td>
                                    </tr>

                                    <tr>
                                      <th scope="row">Total tax</th>
                                      <td id="total_tax_column">
                                        <input
                                          type="hidden"
                                          defaultValue={0}
                                          name="tax_sum"
                                        />{" "}
                                        ₹ {finalAmounts.totalTax}
                                      </td>
                                    </tr>
                                    <tr>
                                      <th scope="row">Grand Total</th>
                                      <td id="grand_total_column">
                                        <input
                                          type="hidden"
                                          defaultValue={0}
                                          name="grand_sum"
                                        />{" "}
                                        ₹ {finalAmounts.grandTotal}
                                      </td>
                                    </tr>
                                    <tr>
                                      <th scope="row">Amount Paid</th>
                                      <td id="amount_paid">
                                        <input
                                          type="hidden"
                                          defaultValue={0}
                                          name="advance_sum"
                                        />{" "}
                                        ₹ {otherCharges.advance || 0}
                                      </td>
                                    </tr>
                                    <tr>
                                      <th scope="row">Amount Due</th>
                                      <td id="due_amount">
                                        <input
                                          type="hidden"
                                          defaultValue={0}
                                          name="due_sum"
                                        />{" "}
                                        ₹{" "}
                                        {+finalAmounts.grandTotal -
                                          (+otherCharges.advance || 0)}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <form
                      className="row"
                      onKeyPress={(event) => (event.key === "Enter" ? "" : "")}
                    >
                      <div className="col-12 mb-4">
                        <div className="form-group">
                          <label> Note for Client </label>
                          <Editor
                            apiKey="xmh8jakgwhfnck35x677xd984brc0hacgqpasnzx3g3ddd12"
                            onInit={(evt, editor) =>
                              (editorRef.current = editor)
                            }
                            value={otherInfo.description}
                            onEditorChange={(newText) =>
                              updateOtherInfo(newText, "description")
                            }
                            init={{
                              height: 200,
                              menubar: ["insert", "link"],
                              toolbar: "image",
                              plugins: [
                                "advlist",
                                "autolink",
                                "lists",
                                "link",
                                "image",
                                "charmap",
                                "preview",
                                "anchor",
                                "searchreplace",
                                "visualblocks",
                                "code",
                                "fullscreen",
                                "insertdatetime",
                                "media",
                                "table",
                                "code",
                                "help",
                                "wordcount",
                              ],
                              toolbar:
                                "undo redo | blocks | " +
                                "bold italic forecolor | alignleft aligncenter " +
                                "alignright alignjustify | bullist numlist outdent indent | " +
                                "removeformat | help",
                              content_style:
                                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                            }}
                          />
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="form-group">
                          <label> Private Note </label>
                          <textarea
                            type="text"
                            className="form-control form-control-alternative"
                            placeholder="Note"
                            name="note"
                            value={otherInfo.note}
                            onChange={updateOtherInfo}
                          />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="form-group">
                          <div className="select-container ">
                            <label className="col-12 ">Bank</label>
                            <CreatableSelect
                              // styles={customStyles}

                              placeholder="Select Type"
                              name="bank"
                              className="w-100"
                              value={otherInfo.bank}
                              onChange={(val) => updateOtherInfo(val, "bank")}
                              isClearable={true}
                              options={bankArray}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="form-group">
                          <div className="select-container ">
                            <label className="col-12 "> Client Type*</label>
                            <CreatableSelect
                              // styles={customStyles}
                              required
                              placeholder="Select Type"
                              name="client_type"
                              className="w-100"
                              value={otherInfo.client_type}
                              onChange={(val) =>
                                updateOtherInfo(val, "client_type")
                              }
                              defaultValue={{
                                label: "Customer",
                                value: "Customer",
                              }}
                              options={[
                                { label: "Customer", value: "Customer" },
                                { label: "Supplier", value: "Supplier" },
                                { label: "Transporter", value: "Transporter" },
                              ]}
                            />
                          </div>
                        </div>
                      </div>
                    </form>

                    {editInvoiceState ? (
                      <button
                        type="submit"
                        className="btn btn-primary me-2"
                        onClick={handleUpdate}
                      >
                        <div className="d-flex justify-content-center">
                          <i className="mdi mdi-content-save "></i>
                          Update
                        </div>
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="btn btn-primary me-2"
                        onClick={handleSubmit}
                      >
                        <div className="d-flex justify-content-center">
                          {" "}
                          <i className="mdi mdi-plus fw-bold"></i> save
                        </div>
                      </button>
                    )}

                    <button
                      className="btn btn btn-secondary"
                      onClick={() => navigate("/invoices")}
                    >
                      <div className="d-flex justify-content-center">
                        <i className="mdi mdi-close "></i>
                        Cancel
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ManageInv;
