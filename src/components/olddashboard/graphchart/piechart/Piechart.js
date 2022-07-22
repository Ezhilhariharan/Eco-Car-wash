import React, { Component } from "react";
import { Chart } from "primereact/chart";

class Piechart extends Component {
  constructor(props) {
    super(props);
    // console.log(this.props.data);
    let labels = [];
    let data = [];

    for (let i of this.props.data) {
      console.log(i);
      labels.push(i.car_type);
      data.push(i.count);
    }

    this.chartData = {
      // labels: labels,
      labels: ['A', 'B', 'C'],
      datasets: [
        {
          data: data,
          backgroundColor: [
            "#2B2E4A",
            "#86CEFA",
            "#73B9EE",
            "#5494DA",
            "#3373C4",
            "#1750AC",
          ],
        },
      ],
    };

    this.lightOptions = {
      plugins: {
        legend: {
          labels: {
            color: "#495057",
          },
        },
      },
    };
  }

  render() {
    return (
      <div className="card">
        <Chart
          type="doughnut"
          data={this.chartData}
          options={this.lightOptions}
          style={{
            position: "relative",
            width: "90%",
            height: "100%",
            margin: "0 auto",
          }}
        />
      </div>
    );
  }
}

export default Piechart;
