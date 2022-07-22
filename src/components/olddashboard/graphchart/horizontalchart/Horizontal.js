import React, { Component } from "react";
import { Chart } from "primereact/chart";
import "./styles/Horizontal.scss";
export class Horizontal extends Component {
  constructor(props) {
    super(props);

    this.basicData = {
      labels: ["Standard", "Premium"],
      datasets: [
        {
          backgroundColor: "#04294B",
          data: [40, 50],
          border: "none",
          borderRadius: "20px",
          fill: false,
        },
      ],
    };

    this.options = this.getLightTheme();
  }

  getLightTheme() {
    let basicOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: "#495057",
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: "#495057",
          },
          grid: {
            color: "#ebedef",
          },
        },
        y: {
          ticks: {
            color: "#495057",
          },
          grid: {
            color: "#ebedef",
          },
        },
      },
    };

    let horizontalOptions = {
      indexAxis: "y",
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: "#495057",
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: "#495057",
          },
          grid: {
            color: "#ebedef",
          },
        },
        y: {
          ticks: {
            color: "#495057",
          },
          grid: {
            color: "#ebedef",
          },
        },
      },
    };

    return {
      horizontalOptions,
    };
  }

  render() {
    const { horizontalOptions } = this.options;

    return (
      <div>
        <div className="card">
          <Chart
            type="bar"
            data={this.basicData}
            options={horizontalOptions}
            className="horizontal"
          />
        </div>
      </div>
    );
  }
}
