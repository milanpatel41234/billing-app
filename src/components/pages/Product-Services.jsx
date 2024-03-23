import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import CreatableSelect from "react-select/creatable";
import Modal from "@mui/material/Modal";
import { fetchCategories } from "./Category";
import { fetchBrands } from "./Brand";
import { fetchTaxes } from "./ManageTax";
import toast from "react-hot-toast";
import Footer from "../helper/Footer";
import { brandApi, productApi, taxApi } from "../assets/apis";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Slide from "@mui/material/Slide";
import { categoryApi } from "../assets/apis";

import { Box } from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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

function ProductServices() {
  const [searchTerm, setSearchTerm] = useState("");
  const [editState, setEditState] = useState(false);
  const [visible, setVisible] = useState(false);
  const [productData, setProductData] = useState([]);
  const queryClient = useQueryClient();
  const [addCategoryVisible, setAddCategoryVisible] = useState(false);
  const [addBrandVisible, setAddBrandVisible] = useState(false);
  const [addTaxVisible, setAddTaxVisible] = useState(false);
  const [categoryArray, setCategoryArray] = useState([]);
  const [brandArray, setBrandArray] = useState([]);
  const [taxArray, setTaxArray] = useState([]);
  const [category, setCategory] = useState({});
  const [editCategoryState, setEditCategoryState] = useState(false);
  const [brand, setBrand] = useState({});
  const [editBrandState, setEditBrandState] = useState(false);
  const [tax, setTax] = useState({
    name: "",
    rate: "",
  });
  const [editTaxState, setEditTaxState] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
  });

  const [addProduct, setAddProduct] = useState({ opening_qty_per: 1 });

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

  // category logic
  const {
    isLoading,
    isError,
    data: categoryData,
    error,
  } = useQuery({
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
  const createCategoryApiCallHandler = async () => {
    if (!category.name) return toast.error("Please provide Category Name");
    try {
      const response = await axios.post(categoryApi, category);

      toast.success("Category added successfully");
      queryClient.invalidateQueries("category");
      setCategory({
        name: "",
        active: true,
      });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  const editCategory = async () => {
    try {
      const response = await axios.put(
        `${categoryApi}/${editCategoryState}`,
        category
      );
      toast.success("Category edited successfully");
      queryClient.invalidateQueries("category");
      setCategory({
        name: "",
        active: false,
      });
      setEditCategoryState(false);
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
  const createBrandApiCallHandler = async () => {
    if (!brand.name) return toast.error("Please provide Brand Name");
    try {
      const response = await axios.post(brandApi, brand);
      toast.success("Brand added successfully");
      queryClient.invalidateQueries("brand");
      setBrand({
        name: "",
        active: true,
      });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  const editBrand = async () => {
    try {
      const response = await axios.put(`${brandApi}/${editBrandState}`, brand);
      toast.success("Brand edited successfully");
      queryClient.invalidateQueries("brand");
      setBrand({
        name: "",
        active: false,
      });
      setEditBrandState(false);
    } catch (error) {
      toast.error(error.response.message);
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

  // tax logic
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
      setTaxArray(temp);
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
  const editTax = async () => {
    try {
      const response = await axios.put(`${taxApi}/${editTaxState}`, tax);
      toast.success("Tax edited successfully");
      queryClient.invalidateQueries("tax");
      setTax({
        name: "",
        rate: "",
      });
      setEditTaxState(false);
    } catch (error) {
      toast.error(error.response.message);
    }
  };
  const deleteTax = async (id) => {
    try {
      const response = await axios.delete(`${taxApi}/${id}`);

      toast.success("Tax deleted successfully");
      queryClient.invalidateQueries("tax");
    } catch (error) {
      toast.error(error.response.message);
    }
  };

  // product section
  const fetchProducts = async () => {
    const response = await axios.get(
      `${productApi}?page=${Number(pagination.currentPage)}&pageSize=${Number(
        pagination.pageSize
      )}&search=${searchTerm}`
    );
    const { products, currentPage, totalPages, success } = response.data;
    setProductData(products);
    setTotalPages(response.data.totalPages);
    return response.data;
  };
  const {
    isProductLoading,
    isProductError,
    data: pData,
    productError,
    refetch,
  } = useQuery({
    queryKey: ["product"],
    queryFn: fetchProducts,
  });
  useEffect(() => {
    refetch();
  }, [pagination]);
  useEffect(() => {
    const timer = setTimeout(refetch, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const editProduct = async () => {
    const payload = {
      ...addProduct,
      brandName: addProduct?.brand?.value,
      categoryName: addProduct?.category?.value,
      type: addProduct?.type?.value,
      taxName: addProduct?.tax?.value,
    };
    delete payload.brand;
    delete payload.category;
    delete payload.tax;
    try {
      const response = await axios.put(
        `${productApi}/${addProduct.id}`,
        payload
      );

      toast.success("Product edited successfully");
      setVisible(false);
      queryClient.invalidateQueries("product");
      setAddProduct({
        id: null,
        name: "",
        active: false,
        description: "",
      });
      setAddProduct({});
      setEditState(false);
    } catch (error) {
      toast.error(error);
    }
  };
  const deleteProduct = async (id) => {
    try {
      const response = await axios.delete(`${productApi}/${id}`);

      toast.success("Product deleted successfully");
      queryClient.invalidateQueries("product");
    } catch (error) {
      toast.error(error);
    }
  };

  const setEditData = (id, data) => {
    setEditState(id);
    setAddProduct({
      ...data,
      name: data.name,
      category: { value: data.categoryName, label: data.categoryName },
      brand: { value: data.brandName, label: data.brandName },
      tax: { value: data.taxName, label: data.taxName },
      type: { value: data.type, label: data.type },
    });
  };

  const handleClose = () => {
    setVisible(false);
    setAddProduct({ opening_qty_per: 1 });
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
      handleClose();
    } catch (error) {
      toast.dismiss(loading);
      if (error.response?.data?.message)
        return toast.error(error.response?.data?.message);
      else return toast.error("something went wrong ");
    }
    toast.dismiss(loading);
  };

  return (
    <div className="main-panel">
      <Modal
        open={addCategoryVisible}
        onClose={(e) => {
          setCategory({ name: "", active: true });
          setEditCategoryState(false);
          setAddCategoryVisible(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        header="Add Category"
        className="col-sm-12"
      >
        <Box sx={style}>
          <h4>Category</h4>
          <div className="d-flex flex-row align-items-center text-align-center ">
            <input
              type="text"
              className="form-control"
              placeholder="Category"
              name="name"
              value={category.name}
              onChange={(e) =>
                setCategory((prev) => {
                  return { ...prev, name: e.target.value };
                })
              }
              readOnly={false}
            />
            <label style={{ margin: "0 4px 0 6px" }}>Active</label>
            <input
              type="checkbox"
              name="active"
              checked={category.active}
              onChange={(e) =>
                setCategory((prev) => {
                  return { ...prev, [e.target.name]: e.target.checked };
                })
              }
            />
            <div className="d-flex">
              {editCategoryState ? (
                <Button
                  style={{
                    height: "1.9rem",
                    width: "2.7rem",
                    borderRadius: "5px",
                    margin: "4px",
                    backgroundColor: "blue",
                    color: "white",
                  }}
                  onClick={editCategory}
                >
                  Edit
                </Button>
              ) : (
                <Button
                  onClick={createCategoryApiCallHandler}
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
              )}
            </div>
          </div>

          <div className="tabel-div">
            <DataTable
              title="Categories"
              value={categoryArray}
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
                header="CATEGORY"
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
                      onClick={(e) => {
                        setCategory({ name: data.name, active: data.active });
                        setEditCategoryState(data.name);
                      }}
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
        </Box>
      </Modal>
      <Modal
        open={addBrandVisible}
        onClose={() => {
          setBrand({ name: "", active: true });
          setEditBrandState(false);
          setAddBrandVisible(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        header="Add Category"
        className="col-sm-12"
      >
        <Box sx={style}>
          <h4>Brand</h4>
          <div className="d-flex flex-row align-items-center ">
            <input
              type="text"
              className="form-control"
              placeholder="Brand Name"
              name="Brand"
              value={brand.name}
              onChange={(e) =>
                setBrand((prev) => {
                  return { ...prev, name: e.target.value };
                })
              }
              readOnly={false}
            />
            <label style={{ margin: "0 4px 0 6px" }}>Active</label>
            <input
              type="checkbox"
              name="active"
              checked={brand.active}
              onChange={(e) =>
                setBrand((prev) => {
                  return { ...prev, [e.target.name]: e.target.checked };
                })
              }
            />
            <div className="d-flex">
              {editBrandState ? (
                <Button
                  style={{
                    height: "1.9rem",
                    width: "2.7rem",
                    borderRadius: "5px",
                    margin: "4px",
                    backgroundColor: "blue",
                    color: "white",
                  }}
                  type="button"
                  onClick={editBrand}
                >
                  Edit
                </Button>
              ) : (
                <Button
                  onClick={createBrandApiCallHandler}
                  style={{
                    height: "1.9rem",
                    width: "2.7rem",
                    borderRadius: "5px",
                    margin: "4px",
                    backgroundColor: "blue",
                    color: "white",
                  }}
                  type="button"
                >
                  Save
                </Button>
              )}
            </div>
          </div>

          <div className="tabel-div">
            <DataTable
              title="Categories"
              value={brandArray}
              style={{ width: "100%" }}
            >
              <Column
                className="border "
                header="SR. No."
                body={(rowData, { rowIndex }) => rowIndex + 1}
                style={{
                  height: "3rem",
                  alignItems: "center",
                  textAlign: "center",
                  minWidth: "5rem",
                }}
              />

              <Column
                className="border "
                field="name"
                header="Brands"
                sortable
                style={{
                  height: "3rem",
                  alignItems: "center",
                  textAlign: "center",
                  minWidth: "9rem",
                }}
              />

              <Column
                className="border "
                body={(data) => (
                  <div
                    style={{
                      minWidth: "50%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <i
                      onClick={(e) => {
                        setBrand({ name: data.name, active: data.active });
                        setEditBrandState(data.name);
                      }}
                      className="dropdown-item-icon mdi mdi-pen text-primary me-2"
                    />
                    <i
                      onClick={(e) => deleteBrand(data.name)}
                      className="dropdown-item-icon mdi mdi-delete-forever text-primary me-2"
                    />
                  </div>
                )}
                header="ACTIONS"
                style={{
                  height: "3rem",
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "center",
                  minWidth: "5rem",
                }}
              />
            </DataTable>
          </div>
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
            {editTaxState ? (
              <Button
                style={{
                  height: "1.9rem",
                  width: "2.7rem",
                  borderRadius: "5px",
                  margin: "4px",
                  backgroundColor: "blue",
                  color: "white",
                }}
                onClick={editTax}
              >
                Edit
              </Button>
            ) : (
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
            )}
          </div>

          <div className="tabel-div">
            <DataTable
              title="Categories"
              value={taxArray}
              style={{ width: "100%" }}
            >
              <Column
                className="border "
                header="SR. No."
                body={(rowData, { rowIndex }) => rowIndex + 1}
                style={{
                  height: "3rem",
                  alignItems: "center",
                  textAlign: "center",
                }}
              />

              <Column
                className="border "
                field="name"
                header="Name"
                sortable
                style={{
                  height: "3rem",
                  alignItems: "center",
                  textAlign: "center",
                }}
              />
              <Column
                className="border "
                field="rate"
                header="Rate"
                sortable
                style={{
                  height: "3rem",
                  alignItems: "center",
                  textAlign: "center",
                }}
              />

              <Column
                className="border "
                body={(data) => (
                  <div
                    style={{
                      minWidth: "50%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <i
                      onClick={(e) => {
                        setTax({ name: data.name, rate: data.rate });
                        setEditTaxState(data.name);
                      }}
                      className="dropdown-item-icon mdi mdi-pen text-primary me-2"
                    />
                    <i
                      onClick={(e) => deleteTax(data.name)}
                      className="dropdown-item-icon mdi mdi-delete-forever text-primary me-2"
                    />
                  </div>
                )}
                header="ACTIONS"
                style={{
                  height: "3rem",
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "center",
                }}
              />
            </DataTable>
          </div>
        </Box>
      </Modal>

      <Dialog
        style={{ zIndex: 700 }}
        PaperProps={{
          style: {
            overflowX: "hidden", // Hide the scrollbar
          },
        }}
        fullScreen
        open={visible}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              Close
              {/* <CloseIcon /> */}
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {/* Sound */}
            </Typography>
            <Button
              onClick={
                addProduct.id ? editProduct : createProductAPICallHandler
              }
              autoFocus
              color="inherit"
            >
              {addProduct.id ? "UPDATE" : "SAVE"}
            </Button>
          </Toolbar>
        </AppBar>
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
                  <span className="" style={{ cursor: "pointer" }}>
                    <i
                      onClick={() => setAddCategoryVisible(true)}
                      className="mdi text-success  fw-bold mdi-plus"
                    />
                  </span>{" "}
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
                  <span className="" style={{ cursor: "pointer" }}>
                    <i
                      onClick={(e) => setAddBrandVisible(true)}
                      className="mdi text-success  fw-bold mdi-plus"
                    />
                  </span>{" "}
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
                  HSN Code
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
                  <span className="" style={{ cursor: "pointer" }}>
                    <i
                      onClick={() => setAddTaxVisible(true)}
                      className="mdi text-success  fw-bold mdi-plus"
                    />
                  </span>{" "}
                </label>
                <CreatableSelect
                  styles={customStyles}
                  name="tax"
                  className="w-100"
                  value={addProduct.tax}
                  onChange={(val) => updateAddProduct(val, "tax")}
                  isClearable
                  options={taxArray}
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
                  S. Price*(Net)
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
                  P. Price*
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
                  Opening Qty per*
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
      </Dialog>

      <div className="content-wrapper  ">
        <div id="first" className="card col-lg-12 p-3">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div className="card-title"> Product & Services</div>
            <button
              className="btn btn-primary"
              onClick={() => setVisible(true)}
            >
              Add Product
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
          <div className="d-flex flex-column  align-items-center datatable">
            <DataTable
              value={productData}
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
                header="ITEM NAME"
                sortable
                style={{
                  height: "3rem",
                  alignItems: "center",
                  textAlign: "center",
                  minWidth: "9rem",
                  padding: "0 5px",
                }}
              />
              <Column
                className="border-bottom border-top"
                field="active"
                body={(rowData) => (rowData.type ? rowData.type : "-")}
                header="TYPE"
                style={{
                  height: "3rem",
                  alignItems: "center",
                  textAlign: "center",
                  minWidth: "5rem",
                  padding: "0 5px",
                }}
              />
              <Column
                className="border-bottom border-top"
                field="active"
                body={(rowData) =>
                  rowData.categoryName ? rowData.categoryName : "-"
                }
                header="CATEGORY"
                style={{
                  height: "3rem",
                  alignItems: "center",
                  textAlign: "center",
                  minWidth: "9rem",
                  padding: "0 5px",
                }}
              />
              <Column
                className="border-bottom border-top"
                field="active"
                body={(rowData) =>
                  rowData.brandName ? rowData.brandName : "-"
                }
                header="BRAND"
                style={{
                  height: "3rem",
                  alignItems: "center",
                  textAlign: "center",
                  minWidth: "5rem",
                  padding: "0 5px",
                }}
              />
              <Column
                className="border-bottom border-top"
                field="opening_qty_per"
                body={(rowData) =>
                  rowData.opening_qty_per ? rowData.opening_qty_per : "0"
                }
                header="QTY"
                sortable
                style={{
                  height: "3rem",
                  alignItems: "center",
                  textAlign: "center",
                  minWidth: "5rem",
                  padding: "0 5px",
                }}
              />
              <Column
                className="border-bottom border-top"
                field="mrp_price"
                body={(rowData) =>
                  rowData.mrp_price ? rowData.mrp_price : "-"
                }
                header="PRICE"
                sortable
                style={{
                  height: "3rem",
                  alignItems: "center",
                  textAlign: "center",
                  minWidth: "5rem",
                  padding: "0 5px",
                }}
              />
              <Column
                className="border-bottom border-top"
                field="UOM"
                body={(rowData) => (rowData.UOM ? rowData.UOM : "-")}
                header="UOM"
                style={{
                  height: "3rem",
                  alignItems: "center",
                  textAlign: "center",
                  minWidth: "5rem",
                  padding: "0 5px",
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
                      style={{ cursor: "pointer" }}
                      onClick={(e) => {
                        setVisible(true);
                        setEditData(data.id, data);
                      }}
                      className="dropdown-item-icon mdi mdi-pen text-primary me-2"
                    />
                    <i
                      style={{ cursor: "pointer" }}
                      onClick={(e) => deleteProduct(data.id)}
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
              <select>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
                <option value="25">25</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ProductServices;
