import { Component } from "react";
import { Route, Switch, withRouter } from "react-router";

import ListCustomers from "./components/listcustomers/ListCustomers";
import ViewCustomer from "./components/viewcustomer/ViewCustomer";

let url;

class CustomerLayout extends Component {
    constructor(props) {
        super(props);
        url = this.props.match.path;
    }

    render() {
        return (
            <div style={{ height: "100%" }}>
                <Switch>
                    <Route exact path={`${url}/`} component={ListCustomers} />
                    <Route path={`${url}/:id`} component={ViewCustomer} />
                </Switch>
            </div>
        );
    }
}

export default CustomerLayout;
