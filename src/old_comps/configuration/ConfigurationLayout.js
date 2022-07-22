import { Component } from "react";
import { Redirect, Route, Switch, withRouter } from "react-router";
import ServicesLayout from "./Component/services/ServicesLayout";
import LeavesLayout from "./Component/leaves/LeavesLayout";
import SwitchTabs from "./Component/switchTabs/SwitchTabs";

let url;

class ConfigurationLayout extends Component {
  constructor(props) {
    super(props);
    url = this.props.match.path;
  }

  render() {
    return (
      <div className="h-100">
        <div className="d-flex flex-row justify-content-between align-items-center" style={{height:"10%"}}>
          <h1>Configuration</h1>
          <div className="d-flex flex-row line ms-auto w-50">
            <SwitchTabs />
          </div>
        </div>
        <div style={{height:"90%"}}>
          <Switch>
            <Redirect exact path={`${url}/`} to={`${url}/services/`} />
            <Route path={`${url}/services/`} component={ServicesLayout} />
            <Route path={`${url}/leave/`} component={LeavesLayout} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default withRouter(ConfigurationLayout);
