import { Component } from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import LoginLayout from "./login/LoginLayout";
import MainNav from "./mainNav/MainNav";
import SideNav from "./sideNav/SideNav";
import Dashboard from "./dashboard/DashboardLayout";
import StoreLayout from "./stores/StoreLayout";
import CustomerLayout from "./customer/CustomerLayout";
import GarageLayout from "./garage/GarageLayout";
import CleanerLayout from "./cleaner/CleanerLayout";
import ManagerLayout from "./manager/ManagerLayout";
import ECommerceLayout from "./ecommerce/ECommerceLayout";
import ConfigurationLayout from "./configuration/ConfigurationLayout";
import OrderLayout from "./orderdetails/OrderLayout";
import LeaveDetails from "./leavedetails/LeaveDetails";
import FinanceModule from "./financemodeule/FinanceModule";
import { Toast } from 'primereact/toast';
import { BlockUI } from "primereact/blockui";

import CarLayout from "./configuration/components/cars/CarLayout";
import { logDOM } from "@testing-library/react";

let path, url;
class Routing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            blockedPanel: false,
            blockedLayer: true,
            urlPath: "",
        };
        path = this.props.location.pathname;
        if (!this.props.user.isloggedin) {
            this.props.history.push("/login");
        } else if (path === "/login") {
            this.props.history.push("/");
        }
        if (localStorage.hasOwnProperty("eco_token")) {
            axios.defaults.headers.common["Authorization"] =
                "Token " + localStorage.getItem("eco_token");
        }
        this.showSuccess = this.showSuccess.bind(this);
        this.ShowLoading = this.ShowLoading.bind(this);
    }
    componentDidUpdate(prevProps, prevState) {
        if (
            this.props.toast.text.length !== 0 &&
            this.props.toast.time !== 0 &&
            prevProps.toast.time !== this.props.toast.time
        ) {
            this.showSuccess();
        }
        if (prevProps.loading.loadingState !== this.props.loading.loadingState) {
            this.ShowLoading();
        }
    }
    ShowLoading() {
        // console.log("from routing");
        this.setState({
            blockedPanel: !this.state.blockedPanel,
            loading: this.props.loading.loadingState,
        });
    }
    showSuccess() {
        this.toast.show({
            //   severity: "success",
            summary: this.props.toast.text,
            life: 5000,
        });
    }
    render() {
        // console.log("loadingState", this.props);
        return (
            <div className="eco-body">
                <Toast ref={(el) => (this.toast = el)} className="toast-style" />
                {this.state.blockedPanel && (
                    <BlockUI blocked={this.state.blockedLayer} fullScreen />
                )}
                {this.props.user.isloggedin ? <SideNav /> : null}
                <main
                    style={
                        !this.props.user.isloggedin ? { width: "100%" } : null
                    }
                >
                    {this.props.user.isloggedin ? <MainNav /> : null}
                    {this.props.menu.is_open ? (
                        <div
                            id="fullscreenblocker"
                            onClick={() => this.props.toggleMenu()}
                        ></div>
                    ) : null}
                    <Switch>
                        <Route exact path="/login">
                            <LoginLayout />
                        </Route>
                        <div className="main-body">
                            <Route exact path="/" component={Dashboard} />
                            <Route path="/stores" component={StoreLayout} />
                            <Route
                                path="/customer"
                                component={CustomerLayout}
                            />
                            <Route path="/garage" component={GarageLayout} />
                            <Route path="/cleaner" component={CleanerLayout} />
                            <Route path="/manager" component={ManagerLayout} />
                            <Route
                                path="/ecommerce"
                                component={ECommerceLayout}
                            />
                            <Route
                                path="/configuration"
                                component={ConfigurationLayout}
                            />
                            <Route
                                path="/orderdetails"
                                component={OrderLayout}
                            />
                            <Route
                                path="/leavedetails"
                                component={LeaveDetails}
                            />

                            <Route path="/finance" component={FinanceModule} />
                            <Route path="/cars" component={CarLayout} />
                        </div>
                    </Switch>
                </main>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
        menu: state.menu,
        toast: state.toast,
        loading: state.loading,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        toggleMenu: () => {
            dispatch({ type: "TOGGLE_MENU" });
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(Routing));
