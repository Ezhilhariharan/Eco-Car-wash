import { Component } from "react";
import { withRouter } from "react-router";

import "./styles/SwitchTabs.scss";
import { NavLink } from "react-router-dom";
import leave from "../leaves/LeavesLayout";

let url;

class SwitchTabs extends Component {
  constructor(props) {
    super(props);
    url = this.props.match.path;
    this.state = {
      serviceNature: "services",
      
    };
  }

  

  changeNature(value) {
    this.setState({ serviceNature: value });
    document.getElementById("leavesTab").classList.remove("active");
    document.getElementById("servicesTab").classList.remove("active");
    document.getElementById(value + "Tab").classList.add("active");
  }

  render() {
    return (
      <div>
        <nav className="d-flex justify-content-around">
          <NavLink className="con-tabs" activeClassName="active" to={`${url}/services/`}>
            <h4 id="servicesTab">
              Services
            </h4>
          </NavLink>
          <NavLink className="con-tabs" activeClassName="active" to={`${url}/leave/`}>
            <h4 id="leavesTab">
              Leaves
            </h4>
          </NavLink>
        </nav>
      </div>
    );
  }
}

export default withRouter (SwitchTabs);
