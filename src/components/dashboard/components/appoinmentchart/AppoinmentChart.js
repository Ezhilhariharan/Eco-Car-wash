import React, { Component } from "react";
import { Chart } from "primereact/chart";
import "./styles/AppointmentChart.scss";
let basicOptions;

export class AppointmentChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dates: [],
            counts: [],
        };
    }
    componentDidMount() {
        this.Emptydates();
    }
    Emptydates() {
        let datas = [];
        let emptycounts = [];
        for (let i of this.props.name) {
            // console.log(i);
            datas.push(i.date);
            emptycounts.push(i.count);
        }

        this.setState({
            dates: datas,
            counts: emptycounts,
        });
        this.myRef = React.createRef();
        this.basicData = {
            labels: datas,
            datasets: [
                {
                    backgroundColor: "#6DDFD8",
                    data: emptycounts,
                },
            ],
        };
        basicOptions = {
            maintainAspectRatio: false,
            aspectRatio: 1.0,
        };
    }

    render() {
        // console.log("kalaisurya", this.state.dates);
        return (
            <Chart
                type="bar"
                data={this.basicData}
                options={basicOptions}
                className="inside"
                ref={this.myRef}
            // style={{ width: "98%", marginTop: "auto" }}
            />
        );
    }
}
