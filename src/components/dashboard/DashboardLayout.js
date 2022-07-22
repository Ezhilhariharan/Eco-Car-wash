import React, { Component } from "react";
import { withRouter, NavLink } from "react-router-dom";
import { Translation } from 'react-i18next';
import { withTranslation } from 'react-i18next';
import {
    getDashBoardData,
    getAppointmentData,
    getAdminDateChange,
    getInteriorData,
    getExteriorData,
    getFeedBack,
} from "./api/Api";
import "./styles/dashboard.scss";
import { AppointmentChart } from "./components/appoinmentchart/AppoinmentChart";
import { ServiceChart } from "./components/servicechart/ServiceChart";
import { Progress } from "react-sweet-progress";
import "react-sweet-progress/lib/style.css";
import CarTypeChart from "./components/cartypechart/CarTypeChart";
import users from "../../assets/admin_images/user.svg";
import store from "../../assets/admin_images/store.svg";
import cleaner from "../../assets/admin_images/cleaner.svg";
import manager from "../../assets/admin_images/manager.svg";
import booking from "../../assets/admin_images/book.svg";
import appleave from "../../assets/admin_images/leaveapprovel.svg";
import appdownload from "../../assets/admin_images/appdownload.svg";
import garage from "../../assets/admin_images/garage.svg";
import { Chart } from "primereact/chart";

import ChartService from "./components/chartservice/ChartService";
import YearPicker from "react-year-picker";
import UserReview from "../common/userReviews/UserReview";
import UserReviewModal from "../common/userReviews/UserReviewModal";

const months = [
    { number: "0", month: "Select Months" },
    { number: "1", month: "January" },
    { number: "2", month: "February" }
    , { number: "3", month: "March" }
    , { number: "4", month: "April" }
    , { number: "5", month: "May" }
    , { number: "6", month: "June" }
    , { number: "7", month: "July" }
    , { number: "8", month: "August" }
    , { number: "9", month: "September" }
    , { number: "10", month: "October" }
    , { number: "11", month: "November" }
    , { number: "12", month: "December" },
]

let labels = [];
let data = [];
let CarTypeChartData = [];
let propsData = [];
let Data = [];
class DashboardLayout extends Component {
    constructor(props) {
        super(props);

        this.state = {
            numberCounts: [],
            chartDateCount: [],
            type: "yearly",
            date: new Date().getFullYear(),
            stdLabels: [],
            stdCountno: [],
            overData: [],
            types: "Interior",
            types1: "Exterior",
            number1: 1,
            Monthly: months,
            cartypeLabel: [],
            cartypeData: [],
            showCartype: false,
        };

        this.myRef = React.createRef();
        this.User_Review = React.createRef();
        this.dashboardData = this.dashboardData.bind(this);
        this.dashboardChart = this.dashboardChart.bind(this);
        this.AdmimGetDatePicker = this.AdmimGetDatePicker.bind(this);
        this.InteriorDatas = this.InteriorDatas.bind(this);
        this.ExteriorDatas = this.ExteriorDatas.bind(this);
        this.options = this.getLightTheme();
        this.getFortms = this.getFortms.bind(this);
        // this.FeedBack = this.FeedBack.bind(this);
    }

    componentDidMount() {
        this.dashboardData();
        this.dashboardChart();
        this.InteriorDatas();
        this.getFortms();
    }
    componentWillUnmount() {
        console.log("componentWillUnmount");
        this.setState({ cartypeLabel: [], cartypeData: [] });
        labels = []
        data = []
    }
    dashboardData() {
        getDashBoardData(this.state.type, this.state.date)
            .then((res) => {
                console.log("getDashBoardData", res.data.Data);
                if (res.data.Status) {
                    this.setState({ numberCounts: [] }, () => {
                        this.setState({ numberCounts: res.data.Data });
                        // this.state.numberCounts
                        // .car_type_apps
                    });
                    if (res.data.Data.hasOwnProperty("car_type_apps")) {
                        CarTypeChartData = res.data.Data.car_type_apps
                        propsData = CarTypeChartData.sort((a, b) => (b.count - a.count))
                        Data = propsData.splice(0, 4)
                        for (let i of Data) {
                            labels.push(i.car_type);
                            data.push(i.count);
                        }
                        this.setState({ cartypeLabel: labels, cartypeData: data, showCartype: true });
                    }
                } else {
                    console.error(res)
                }
            })
            .catch((err) => console.log(err));
    }

    dashboardChart() {
        getAppointmentData(this.state.type, this.state.date)
            .then((res) => {
                console.log("thala", res.data.Data);
                if (res.data.Status) {
                    this.setState({ chartDateCount: [] }, () => {
                        this.setState({ chartDateCount: res.data.Data });
                    });
                } else {
                    console.error(res)
                    this.setState({ chartDateCount: [] })
                }
            })
            .catch((err) => {
                console.log(err)
                this.setState({ chartDateCount: [] })
            });
    }

    AdmimGetDatePicker() {
        getAdminDateChange()
            .then((res) => {
                // console.log(res, "received resdate");
            })
            .catch((err) => {
                console.log(err, "message for err date");
            });
    }

    InteriorDatas() {
        getInteriorData(this.state.types)
            .then((res) => {
                if (res.data.Status) {
                    this.setState({ stdLabels: res.data.Data.labels });
                    this.setState({ stdCountno: res.data.Data.data });
                } else {
                    console.error(res)
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    ExteriorDatas() {
        getExteriorData(this.state.types1)
            .then((res) => {
                // console.log("kalaisurya", res.data.Data);
                if (res.data.Status) {
                    this.setState({ stdLabels: res.data.Data.labels });
                    this.setState({ stdCountno: res.data.Data.data });
                } else {
                    console.error(res)
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }


    getFortms() {
        this.basicData = {
            // labels: ["kalai", "nazriya"],
            labels: this.state.stdLabels,
            datasets: [
                {
                    backgroundColor: "#04294B",
                    data: this.state.stdCountno,
                    borderRadius: "20px",
                    fill: false,
                    border: "2px solid red",
                },
            ],
        };
    }
    getLightTheme() {
        let horizontalOptions = {
            indexAxis: "y",
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    labels: {
                        color: "#495057",
                    },
                },
            },
            rendererOptions: {
                barHeight: 26,
            },
            scales: {
                x: {
                    ticks: {
                        color: "#495057",
                    },
                    grid: {
                        color: "#ebedef",
                    },
                },
                y: {
                    ticks: {
                        color: "#495057",
                    },
                    grid: {
                        color: "#ebedef",
                    },
                },
            },
        };

        return {
            horizontalOptions,
        };
    }
    render() {
        // label={this.state.cartypeLabel} Data={this.state.cartypeData}
        console.log("numberCounts", this.state.cartypeLabel, this.state.cartypeData);
        const { horizontalOptions } = this.options;
        const { t } = this.props
        return (
            <div className="dashboard-layout">
                <div className="dashboard-left">
                    <div className="analytics-box">
                        <div className="analytics-left">
                            <img src={booking} />
                        </div>
                        <div className="analytics-right">
                            <span className="title">{t('Booking')}</span>
                            <span className="number">
                                {this.state.numberCounts.appointment_count}
                            </span>
                        </div>

                        <NavLink to="/orderdetails?status=Booking" className="btn-navy-circle">
                            <i className="fa fa-chevron-right"></i>
                        </NavLink>
                    </div>
                    <div className="analytics-box">
                        <div className="analytics-left">
                            <img src={store} />
                        </div>
                        <div className="analytics-right">
                            <span className="title">{t('Stores')}</span>
                            <span className="number">
                                {this.state.numberCounts.store_count}
                            </span>
                        </div>
                        <button className="btn-white-circle d-none">
                            <i className="fa fa-plus"></i>
                        </button>
                        <NavLink to="/stores" className="btn-navy-circle">
                            <i className="fa fa-chevron-right"></i>
                        </NavLink>
                    </div>
                    <div className="analytics-box">
                        <div className="analytics-left">
                            <img src={users} />
                        </div>
                        <div className="analytics-right">
                            <span className="title">{t('Customer')}</span>
                            <span className="number">
                                {this.state.numberCounts.user_count}
                            </span>
                        </div>
                        <NavLink to="/customer" className="btn-navy-circle">
                            <i className="fa fa-chevron-right"></i>
                        </NavLink>
                    </div>

                    <div className="analytics-box">
                        <div className="analytics-left">
                            <i class="fa-solid fa-garage-car"></i>
                        </div>
                        <div className="analytics-right">
                            <span className="title">{t('Garage')}</span>
                            <span className="number">
                                {this.state.numberCounts.garage_count}
                            </span>
                        </div>
                        <button className="btn-white-circle d-none">
                            <i className="fa fa-plus"></i>
                        </button>
                        <NavLink to="/garage" className="btn-navy-circle">
                            <i className="fa fa-chevron-right"></i>
                        </NavLink>
                    </div>
                    <div className="analytics-box">
                        <div className="analytics-left">
                            <img src={cleaner} />
                        </div>
                        <div className="analytics-right">
                            <span className="title">{t('Cleaner')}</span>
                            <span className="number">
                                {this.state.numberCounts.cleaner_count}
                            </span>
                        </div>
                        <button className="btn-white-circle d-none">
                            <i className="fa fa-plus"></i>
                        </button>
                        <NavLink to="/cleaner" className="btn-navy-circle">
                            <i className="fa fa-chevron-right"></i>
                        </NavLink>
                    </div>

                    <div className="analytics-box">
                        <div className="analytics-left">
                            <img src={manager} />
                        </div>
                        <div className="analytics-right">
                            <span className="title">{t('Manager')}</span>
                            <span className="number">
                                {this.state.numberCounts.manager_count}
                            </span>
                        </div>
                        <button className="btn-white-circle d-none">
                            <i className="fa fa-plus"></i>
                        </button>
                        <NavLink to="/manager" className="btn-navy-circle">
                            <i className="fa fa-chevron-right"></i>
                        </NavLink>
                    </div>
                    <div className="analytics-box">
                        <div className="analytics-left">
                            <img src={appdownload} />
                        </div>
                        <div className="analytics-right">
                            <span className="title">{t('App Download')}</span>
                            <span className="number">
                                {this.state.numberCounts.store_count}
                            </span>
                        </div>
                    </div>
                    <div className="analytics-box">
                        <div className="analytics-left">
                            <img src={appleave} />
                        </div>
                        <div className="analytics-right">
                            <span className="title">{t('leave approval')}</span>
                            <span className="number">
                                {this.state.numberCounts.leave_count}
                            </span>
                        </div>
                        <NavLink to="/leavedetails" className="btn-navy-circle">
                            <i className="fa fa-chevron-right"></i>
                        </NavLink>
                    </div>
                </div>
                <div className="dashboard-right">
                    <div className="start-chart-box">
                        <div className="d-flex flex-row w-100">
                            <h5 className="col-4 pt-2">{t('Number of Booking')}</h5>
                            <div className="inside_split ">
                                <div className="round">
                                    <select
                                        className="select-dates"
                                        onChange={(e) => {
                                            let date = new Date();
                                            if (e.target.value === "yearly") {
                                                date = date.getFullYear();
                                            } else {
                                                date = `${date.getFullYear()}-${date.getMonth() + 1}`;
                                            }
                                            this.setState(
                                                {
                                                    type: e.target.value,
                                                    date: date,
                                                },
                                                () => {
                                                    this.dashboardChart()
                                                    this.dashboardData();
                                                    ;
                                                }
                                            );
                                        }}
                                    >
                                        <option value="yearly">{t('Yearly')}</option>
                                        <option value="monthly">{t('monthly')}</option>
                                    </select>
                                    <div>
                                        {this.state.type === "yearly" ? (
                                            <YearPicker
                                                //target the class this component creates to edit conponent
                                                onChange={(date) => {
                                                    console.log(date);
                                                    this.setState(
                                                        { date: date },
                                                        () => {
                                                            this.dashboardChart()
                                                            this.dashboardData();
                                                            ;
                                                        }
                                                    );
                                                }}
                                            />
                                        ) : (
                                            <select
                                                className="select-dates"
                                                onChange={(e) => {
                                                    console.log("monthly", e.target.value)
                                                    if (e.target.value != 0) {
                                                        let date = new Date();
                                                        if (e.target.value === "yearly") {
                                                            date = date.getFullYear();
                                                        } else {
                                                            date = `${date.getFullYear()}-${e.target.value}`;
                                                        }
                                                        this.setState(
                                                            {
                                                                type: this.state.type,
                                                                date: date,
                                                            },
                                                            () => {
                                                                this.dashboardChart();
                                                                this.dashboardData();
                                                            }
                                                        );
                                                    } else {
                                                        console.log("cool");
                                                        this.setState({ chartDateCount: [] })
                                                    }
                                                }}
                                            >
                                                {this.state.Monthly.map((option, index) => (
                                                    <option value={option.number} key={index}>{option.month}</option>
                                                ))}
                                            </select>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="chart">
                            {this.state.chartDateCount.length > 0 ? (
                                <AppointmentChart
                                    name={this.state.chartDateCount}
                                />
                            ) : <h3 className="mx-auto my-auto">{t('No Record Found')}</h3>}
                        </div>
                    </div>
                    <div className="middle-chart-box">
                        <div className="starts-chart-box">
                            <div>
                                <ChartService type={this.state.type} date={this.state.date} />
                            </div>
                        </div>

                        <div className="middles-chart-box">
                            <div className="header-title">
                                <span>{t('Feedback')}</span>
                                <span className="view-more" onClick={() => this.User_Review.current.showModal()}>{t('View more')}</span>
                            </div>
                            <UserReview URL="dashboard" showApprove="false" />
                        </div>
                        <div className="ends-chart-box">
                            <div className="header-title">
                                <span>{t('Car Type')}</span>
                            </div>
                            <div className="chart-rounds">
                                {this.state.showCartype
                                    ? (
                                        <CarTypeChart
                                            label={this.state.cartypeLabel} Data={this.state.cartypeData}
                                        />
                                    ) : <h3 className="mx-auto my-auto">{t('No Record Found')}</h3>}
                            </div>
                        </div>
                    </div>
                </div>
                <UserReviewModal ref={this.User_Review} URL="dashboard" showApprove="true" />
            </div>

        );
    }
}

export default withTranslation()(withRouter(DashboardLayout));
