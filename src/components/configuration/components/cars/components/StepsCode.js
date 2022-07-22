import React, { Component } from "react";

export default class StepsCode extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step1: "1",
            step2: "2",
            step3: "3",
        };
    }

    getstepsData() {
        if (this.state.step1 === 1) {
            alert("step 1");
        } else if (this.state.step2 === 2) {
            alert("step 2");
        } else if (this.state.step3 === 3) {
            alert("step 3");
        }
    }

    render() {
        return <div>welcome</div>;
    }
}
