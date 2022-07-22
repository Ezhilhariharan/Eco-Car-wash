import React, { Component } from "react";
import { Chart } from "primereact/chart";
import './styles/Charts.scss';
let basicOptions;

export class Charts extends Component {
  constructor(props) {
    super(props);
    // console.log("mani", props.name);
    let dates = [];
    let counts = [];

    for (let i of this.props.name) {
      console.log(i);
      dates.push(i.date);
      counts.push(i.count);
    }
    this.myRef = React.createRef();
    this.basicData = {
      labels: dates,
      datasets: [
        {
          backgroundColor: "#6DDFD8",
          data: counts,
        },
      ],
    };
    basicOptions = {
      maintainAspectRatio: false,
      aspectRatio: 1.0,
    }
   
  }

  render() {
    return (
      <div className="charts">
          <Chart
        type="bar"
        data={this.basicData}
        options={basicOptions}
        className="inside"
        ref={this.myRef}
        style={{width:"80%"}}       
      />
      </div>
    );
  }
}
