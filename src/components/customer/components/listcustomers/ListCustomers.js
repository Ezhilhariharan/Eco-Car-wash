import React, { Component } from "react";
import { NavLink, withRouter } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import axios from "axios";
import { connect } from "react-redux";
import { withTranslation } from 'react-i18next';

import { CustomerData } from "../../assets/CustomerData";
import "./style/ListCustomers.scss";

let url;
class ListCustomers extends Component {
    constructor(props) {
        super(props);
        url = this.props.match.url;
        this.state = {
            page: 1,
            lock: false,
            customers: {},
            inputFeild: "",
            cartypeList: [],
            cartype: "",
        };
        this.cust = new CustomerData();
        this.getCleanerList = this.getCleanerList.bind(this);
        this.scrollLoader = this.scrollLoader.bind(this);
        this.custRedirect = this.custRedirect.bind(this);
    }

    componentDidMount() {
        this.getCleanerList();
        this.scrollLoader();
        this.props.toggleMenu();
        let List = [{ id: "", value: "Car Type" }];
        axios
            .get(`/admin/manage_cartype/`)
            .then((res) => {
                console.log("manage_cartype", res.data.Data);
                for (let i of res.data.Data.filter((item) => item.status == "active")) {
                    List.push({ id: i.id, value: i.name });
                }
                this.setState({ cartypeList: List })
            })
            .catch((err) => {
                console.log(err);
            });

    }
    componentWillUnmount() {
        console.log("componentWillUnmount-customer", this.props.menu.searchFeild);
        this.props.toggleMenu();
        this.setState({ inputFeild: "" })
        this.props.searchFeild("");
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevState.inputFeild !== this.props.menu.searchFeild) {
            this.setState({ inputFeild: this.props.menu.searchFeild, customers: {}, page: 1 }, () => {
                this.getCleanerList(true);
            });
        }
    }
    scrollLoader() {
        let scroller = document.getElementsByClassName(
            "p-datatable-scrollable-body"
        )[0];
        let scrollerBody = document.getElementsByClassName(
            "p-datatable-scrollable-body-table"
        )[0];
        scroller.addEventListener("scroll", () => {
            if (
                scroller.scrollTop >
                (scrollerBody.clientHeight - scroller.clientHeight) * 0.85
            ) {
                if (!this.state.lock && this.state.customers.next) {
                    this.setState({ lock: true }, () => {
                        this.setState({ page: this.state.page + 1 }, () => {
                            this.getCleanerList();
                        });
                    });
                }
            }
        });
    }

    getCleanerList(reset = false) {
        let Params = {};
        if (this.state.inputFeild !== "") {
            Params = { name: this.state.inputFeild };
        }
        // if (this.state.cartype !== "") {
        //     Params = { car_type: this.state.cartype };
        // }
        axios
            .get(`/admin/manage_customer/?page_no=${this.state.page}&car_type=${this.state.cartype}`, { params: { search: JSON.stringify(Params) } })
            .then((res) => {
                console.log(res.data.Data);
                if (Object.keys(this.state.customers).length != 0 && !reset) {
                    let list = this.state.customers.results;
                    list.push(...res.data.Data.results);
                    res.data.Data.results = list;
                    // console.log(res.data.Data);
                    this.setState({ customers: res.data.Data });
                } else {
                    this.setState({ customers: res.data.Data });
                }
                this.setState({ lock: false });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    custRedirect(rowData) {
        this.props.history.push(`${url}/${rowData.data.username}`);
    }
    carType = (e) => {
        console.log("value", e.target.value,);
        this.setState({ cartype: e.target.value, customers: [] }, () => { this.getCleanerList(true); });
    }
    render() {
        // console.log("props", this.props);
        const { t } = this.props
        return (
            <div className="list-customers">
                <div className="d-flex flex-row">
                    <h2>{t('Customer List')}</h2>
                    <div className=" form-group-select ">
                        <select className="custom-select-2 ms-5" onChange={this.carType}>
                            {this.state.cartypeList.map((option) => (
                                <option value={option.id}>{t(`${option.value}`)}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="list-customers-body">
                    <DataTable
                        value={this.state.customers.results}
                        scrollable
                        scrollHeight="100%"
                        onRowClick={this.custRedirect}
                        emptyMessage={t('No Record Found')}
                    >
                        <Column
                            field="name"
                            header={t('Name')}
                            body={this.cust.nameTemplate}
                        ></Column>
                        <Column
                            field="mobile_no"
                            header={t('mobile no')}
                            body={this.cust.phoneTemplate}
                        ></Column>
                        <Column
                            field="email"
                            header={t('Email')}
                            body={this.cust.emailTemplate}
                        ></Column>
                        <Column
                            field="leave"
                            header={t('Car Type')}
                            body={this.cust.carTypeTemplate}
                        ></Column>
                        <Column
                            field="orders"
                            header={t('No. of orders')}
                            body={this.cust.appointmentTemplate}
                        ></Column>
                    </DataTable>
                </div>
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        menu: state.menu,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        toggleMenu: () => {
            dispatch({ type: "SEARCH_BAR" });
        },
        searchFeild: (value) => {
            dispatch({ type: "SEARCH_FEILD", data: value });
        }
    };
};

export default withTranslation()(connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(ListCustomers)));

// export default withRouter(ListCustomers);
