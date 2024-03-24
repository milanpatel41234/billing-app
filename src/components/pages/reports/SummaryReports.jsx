import React, { useEffect, useState } from "react";
import { Chart } from "primereact/chart";

const SummaryReports = () => {
  // pie chart states
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  // bars chart states

  const [chartDataBar, setChartBarData] = useState({});
  const [chartOptionsBar, setChartBarOptions] = useState({});

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const data = {
      labels: ["A", "B", "C"],
      datasets: [
        {
          data: [540, 325, 702],
          backgroundColor: [
            "rgba(255, 99, 132, 0.5)",
            "rgba(54, 162, 235, 0.5)",
            "rgba(255, 206, 86, 0.5)",
            "rgba(25, 26, 86, 0.5)",
          ],
          hoverBackgroundColor: [
            "rgba(255, 99, 132, 0.5)",
            "rgba(54, 162, 235, 0.5)",
            "rgba(255, 206, 86, 0.5)",
            "rgba(25, 26, 86, 0.5)",
          ],
        },
      ],
    };
    const options = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
          },
        },
      },
    };

    setChartData(data);
    setChartOptions(options);

    // pie chart section end

    // bar charts section start
    const dataBar = {
      labels: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      datasets: [
        {
          label: "Sales",
          data: [540, 325, 702, 620, 450, 678, 530, 610, 720, 650, 590, 700], // Update this array with your actual data
          backgroundColor: [
            "rgba(255, 99, 132, 0.5)",
            "rgba(54, 162, 235, 0.5)",
            "rgba(255, 206, 86, 0.5)",
            "rgba(75, 192, 192, 0.5)",
            "rgba(153, 102, 255, 0.5)",
            "rgba(255, 159, 64, 0.5)",
            "rgba(255, 99, 132, 0.7)",
            "rgba(54, 162, 235, 0.7)",
            "rgba(255, 206, 86, 0.7)",
            "rgba(75, 192, 192, 0.7)",
            "rgba(153, 102, 255, 0.7)",
            "rgba(255, 159, 64, 0.7)",
          ],
          borderColor: [
            "rgb(255, 99, 132)",
            "rgb(54, 162, 235)",
            "rgb(255, 206, 86)",
            "rgb(75, 192, 192)",
            "rgb(153, 102, 255)",
            "rgb(255, 159, 64)",
            "rgb(255, 99, 132)",
            "rgb(54, 162, 235)",
            "rgb(255, 206, 86)",
            "rgb(75, 192, 192)",
            "rgb(153, 102, 255)",
            "rgb(255, 159, 64)",
          ],
          borderWidth: 1,
        },
      ],
    };

    const optionsBar = {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };

    setChartBarData(dataBar);
    setChartBarOptions(optionsBar);
  }, []);

  return (
    <div className="col-lg-12">
      <div className="row ">
        <div class="col-lg-12 d-flex flex-column grid-margin grid-margin-lg-0 stretch-card">
          <div class="card" style={{ backgroundColor: "transparent" }}>
            <div class="card-body d-flex justify-content-around">
              {/* <h4 class="card-title">Pie chart</h4> */}
              <Chart
                type="pie"
                data={chartData}
                options={chartOptions}
                className="w-full md:w-30rem"
              />

              <Chart
                type="pie"
                data={chartData}
                options={chartOptions}
                className="w-full md:w-30rem"
              />
            </div>
            <hr />
            <div className="row">
              <Chart type="bar" data={chartDataBar} options={chartOptionsBar} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryReports;
