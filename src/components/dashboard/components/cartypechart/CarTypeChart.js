import React, { Component } from "react";
import { Chart } from "primereact/chart";

class CarTypeChart extends Component {
    constructor(props) {
        super(props);
        console.log("doughnut", this.props.label, this.props.Data);
        // let labels = [];
        // let data = [];
        // let CarTypeChart = this.props.data
        // let propsData = CarTypeChart.sort((a, b) => (b.count - a.count))
        // let Data = propsData.splice(0, 4)
        // console.log("propsData", Data);
        // for (let i of propsData.splice(4)) {
        //     console.log(i);
        //     labels.push(i.car_type);
        //     data.push(i.count);
        // }
        // count = data.sort((a, b) => (b - a))
        // console.log("count",data,"labels",labels);
        this.chartData = {
            // labels: labels,
            labels: [...this.props.label],
            datasets: [
                {
                    data: this.props.Data,
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
            <div className="cards">
                <Chart
                    type="doughnut"
                    data={this.chartData}
                    options={this.lightOptions}
                    style={{
                        position: "relative",
                        width: "70%",
                        height: "100%",
                        margin: "0 auto",
                    }}
                />
            </div>
        );
    }
}

export default CarTypeChart;
