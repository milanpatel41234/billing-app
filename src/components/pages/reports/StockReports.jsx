import React, { useState } from "react";
import { productApi } from "../../assets/apis";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const StockReports = () => {
  const [productArray, setProductArray] = useState([]);

  const fetchProducts = async () => {
    const response = await axios.get(`${productApi}`);
    const { products } = response.data;
    setProductArray(products);
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

  return (
    <>
      <div className="container text-center m-4 mx-auto">
        <div className="row">
          <div className="col">
            <span className="btn btn-danger me-2" />
            <span id="outOfStock">Out of Stock</span>
          </div>
          <div className="col">
            <span className="btn btn-warning me-2" />
            <span id="runningOut">Running Out</span>
          </div>
          <div className="col">
            <span className="btn btn-success me-2" />
            <span id="inStock">In Stock</span>
          </div>
        </div>
      </div>
      <div className="table-responsive">
        <table
          className="table align-items-center table-flush mb-3"
          id="stock_table"
        >
          {/* klflkd */}
          <thead>
            <tr>
              <th scope="col">Sr. No.</th>
              <th scope="col">Name</th>
              <th scope="col">Qty</th>
              <th scope="col">Category</th>
              <th scope="col">Brand</th>
              {/* <th scope="col">Qty</th> */}
              <th scope="col">Unit Price</th>
              <th scope="col">Sale Price</th>
              <th scope="col">Type</th>
            </tr>
          </thead>
          <tbody>
            {productArray.map((prod, idx) => (
              <tr>
                <th scope="row">{idx+1}</th>
                <td>{prod.name}</td>
                <td>
                  <b>
                    <span className={prod.opening_qty_per < 1 ?"text-danger" : "text-success"}>{prod.opening_qty_per}</span>
                  </b>
                </td>
                <td>{prod.categoryName || "--"}</td>
                <td>{prod.brandName || "--"}</td>
                {/* <td>
                                 5
                             </td> */}
                <td>₹ {prod.mrp_price || 0}</td>
                <td>₹ {prod.s_price || 0}</td>
                <td>{prod.type}</td>
              </tr>
            ))}
          </tbody>
          <tbody></tbody>
        </table>

        <div className="table-responsive">
          <table
            className="table align-items-center table-flush mt-5"
            id="table_totals"
          >
            <thead>
              <tr>
                <td>
                  <b>Total Items</b>
                </td>
                <td>
                  <b>
                    <span id="item_count">6</span>
                  </b>
                </td>
                <td />
                <td>
                  <b>Total</b>
                </td>
                <td>
                  <b>Total Value</b>
                </td>
                <td />
                <td>
                  <b>Total</b>
                </td>
                <td>
                  <b>Total Value</b>
                </td>
              </tr>
            </thead>
            <thead>{/* used in js */}</thead>
            <tbody>
              <tr>
                <th />
                <td />
                <td>
                  <b>Products</b>
                </td>
                <td>
                  <b>
                    <span id="product_count">5</span>
                  </b>
                </td>
                <td>
                  <b>
                    <span id="sum_products">₹ 412.00</span>
                  </b>
                </td>
                <td>
                  <b>Services</b>
                </td>
                <td>
                  <b>
                    <span id="service_count">1</span>
                  </b>
                </td>
                <td>
                  <b>
                    <span id="sum_service">₹ 100.00</span>
                  </b>
                </td>
              </tr>
            </tbody>
            <tbody>{/* used in js */}</tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default StockReports;
