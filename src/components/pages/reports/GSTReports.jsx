import React, { useState } from "react";

const GSTReports = () => {
  const [summary, setSummary] = useState([1]);

  return (
    <>
      <div className="col-12 h-5">
        <div className="row"></div>
      </div>
      <div className="table-responsive">
        <table
          className="table align-items-center table-flush mb-3"
          id="invoice_report_table"
        >
          {/* klflkd */}
          <thead>
            <tr>
              {/* <th scope="col">Sr. No.</th> */}
              <th scope="col">Contact</th>
              <th scope="col">Contact Type</th>
              <th scope="col">Total Inv.</th>
              <th scope="col">Amount Without Tax</th>
              <th scope="col">Amount With Tax</th>
              <th scope="col">Paid</th>
              <th scope="col">Balance</th>
            </tr>
          </thead>
          <tbody>
            {summary.map((summary) => (
              <tr>
                {/* <th scope="row">1</th> */}
                <td>Milan Patel</td>
                <td>Customer</td>
                <td>
                  <b>2</b>
                </td>
                <td>₹ 11.40</td>
                <td>₹ 13.00</td>
                <td>₹ 13.00</td>
                <td>₹ 0.00</td>
              </tr>
            ))}
            {/* <th scope="row">2</th> */}
          </tbody>
        </table>
      </div>

      <div class="table-responsive">
        <table className="table align-items-center table-flush mt-5">
          <thead>
            <tr>
              <td>
                <b>Total Invoices</b>
              </td>
              <td>
                <b>
                  <span id="invoices_count">5</span>
                </b>
              </td>
              <td>
                <b>Amount Without Tax</b>
              </td>
              <td>
                <b>
                  <span id="no_tax_amount">₹ 211.40</span>
                </b>
              </td>
              <td>
                <b>Amount With Tax</b>
              </td>
              <td>
                <b>
                  <span id="tax_amount">₹ 213.00</span>
                </b>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>
                <b>Paid</b>
              </th>
              <th style={{ color: "green" }}>
                <b>
                  <span id="paid">₹ 13.00</span>
                </b>
              </th>
              <th>
                <b>Balance</b>
              </th>
              <th style={{ color: "red" }}>
                <b>
                  <span id="balance">₹ 200.00</span>
                </b>
              </th>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default GSTReports;
