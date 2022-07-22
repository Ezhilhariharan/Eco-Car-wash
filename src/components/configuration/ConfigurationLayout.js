import React, { Component } from "react";
import { Switch, Route, Redirect, NavLink, withRouter } from "react-router-dom";

import ServiceLayout from "./components/service/ServiceLayout";
import LeaveConfig from "./components/leave/LeaveConfig";
import Coupons from "./components/coupon/Coupons";

import CarTypeCreation from "./components/cartype/CarTypeCreation";
import GiftCoupons from "./components/giftcoupons/GiftCoupons";

import CarLayout from "./components/cars/CarLayout";
import CarModelLayout from "./components/carmodal/CarModelLayout";

let url;
class ConfigurationLayout extends Component {
    constructor(props) {
        super(props);
        url = this.props.match.url;
    }

    render() {
        return (
            <div className="h-100 w-100">
                <Switch>
                    <Redirect exact from={`${url}/`} to={`${url}/services`} />
                    <Route
                        exact
                        path={`${url}/services`}
                        component={ServiceLayout}
                    />
                    <Route
                        exact
                        path={`${url}/leave`}
                        component={LeaveConfig}
                    />
                    <Route exact path={`${url}/coupons`} component={Coupons} />
                    <Route
                        exact
                        path={`${url}/giftcoupons`}
                        component={GiftCoupons}
                    />
                    <Route
                        exact
                        path={`${url}/cartype`}
                        component={CarTypeCreation}
                    />
                    <Route exact path={`${url}/cartype/:id`} component={CarLayout} />
                    <Route
                        exact
                        path={`${url}/cartype/carmodel/:id`}
                        component={CarModelLayout}
                    />
                    {/* <Route path={`${url}/cars/:id`} component={CarLayout} /> */}

                    <Route exact path={`${url}/carmodel`} component={Coupons} />
                </Switch>
            </div>
        );
    }
}

export default withRouter(ConfigurationLayout);
