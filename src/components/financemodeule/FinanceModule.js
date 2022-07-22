import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import YearPicker from "react-year-picker";
import { GetFinance, GetFinanceCartypes } from "./api/GET";
import { withTranslation } from 'react-i18next';

import FinanceModal from "./modals/FinanceModal";

import "./styles/FinanceModule.scss";

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
class FinanceModule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            finance: [],
            financeCartype: [],
            type: "yearly",
            date: new Date().getFullYear(),
            month: new Date().getMonth() + 1 >= 9 ? new Date().getMonth() + 1 : '0' + (new Date().getMonth() + 1),
            year: new Date().getFullYear(),
            Monthly: months,
        };
        // console.log(url, "reaceived url match");
        this.getFinanceData = this.getFinanceData.bind(this);
        this.flatdate = React.createRef();
        this.financeRef = React.createRef();
        this.loadFinanceModal = this.loadFinanceModal.bind(this);
    }

    componentDidMount() {
        this.getFinanceData();
    }

    getFinanceData() {
        GetFinance(this.state.type, this.state.date)
            .then((res) => {
                console.log("GetFinance", res.data.Data);
                // this.setState({finance:[]
                // },() => { this.setState({ finance: res.data.Data }))
                if (res.data.Status) {
                    this.setState({ finance: [] }, () => {
                        this.setState({ finance: res.data.Data });
                    });
                } else {
                    console.error(res)
                    this.setState({ finance: [] })
                }
            })
            .catch((err) => {
                console.log(err)
                this.setState({ finance: [] })
            });
    }

    loadFinanceModal(rowData) {
        console.log(rowData.data);
        let date;
        if (this.state.type === "yearly") {
            date = (new Date(`${this.state.date} ${rowData.data.date}`).getMonth() + 1);
        } else {
            date = rowData.data.date;
        }
        if (date < 10) {
            date = `0${date}`;
        }
        date = `${this.state.date}-${date}`;
        console.log(date);
        GetFinanceCartypes(this.state.type, date).then(
            res => {
                this.setState({ financeCartype: res.data.Data });
                this.financeRef.current.showModal();
            },
            err => console.log(err)
        )
        // this.financeRef.current.showModal();
    }

    render() {
        const { t } = this.props
        return (
            <div className="finance-layout">
                <div className="finance-header">
                    <h2 className="finance-title">{t('Finance')}</h2>
                    <div className="col-3">
                        <select
                            name="type"
                            className="form-select"
                            aria-label="Type Selection"
                            onChange={(e) => {
                                if (e.target.value === 'yearly') {
                                    this.setState({
                                        type: e.target.value,
                                        date: new Date().getFullYear(),
                                    }, () => {
                                        this.getFinanceData();
                                    })
                                } else {
                                    this.setState(
                                        {
                                            type: e.target.value,
                                            date: `${new Date().getFullYear()}-${new Date().getMonth() + 1 >= 9 ? new Date().getMonth() + 1 : '0' + (new Date().getMonth() + 1)}`,
                                        },
                                        () => {
                                            this.getFinanceData();
                                        }
                                    );
                                }
                            }}
                        >
                            <option value="yearly">{t('Yearly')}</option>
                            <option value="monthly">{t('monthly')}</option>
                        </select>
                    </div>
                    <div className="col-3">
                        {this.state.type === "yearly" ? (
                            <YearPicker
                                onChange={(date) => {
                                    this.setState(
                                        {
                                            date: date,
                                        },
                                        () => {
                                            this.getFinanceData();
                                        }
                                    );
                                }}
                            />
                        ) : (
                            // <input
                            //     type="date"
                            //     className="form-control"
                            //     onChange={(e) => {
                            //         let date = new Date(e.target.value);
                            //         this.setState(
                            //             {
                            //                 date: `${date.getFullYear()}-${
                            //                     date.getMonth() + 1
                            //                 }`,
                            //             },
                            //             () => {
                            //                 this.getFinanceData();
                            //             }
                            //         );
                            //     }}
                            // />
                            <select
                                className="select-dates form-control"
                                onChange={(e) => {
                                    // console.log("monthly", e.target.value)
                                    if (e.target.value != 0) {
                                        let date = new Date();
                                        // if (e.target.value === "yearly") {
                                        //     date = date.getFullYear();
                                        // } else {
                                        date = `${date.getFullYear()}-${e.target.value}`;
                                        // }
                                        this.setState(
                                            {
                                                type: this.state.type,
                                                date: date,
                                            },
                                            () => {
                                                this.getFinanceData();
                                            }
                                        );
                                    } else {
                                        console.log("cool");
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
                <div className="finance-list">
                    <DataTable
                        value={this.state.finance}
                        scrollable
                        scrollHeight="100%"
                        onRowClick={this.loadFinanceModal}
                        emptyMessage={t('No Record Found')}
                    >
                        <Column
                            field="date"
                            header={
                                this.state.type === t('Yearly') ? t('Month') : t('Day')
                            }
                        ></Column>
                        <Column
                            field="app_count"
                            header={t('Appointments')}
                        ></Column>
                        <Column field="std_count" header={t('Standard')}></Column>
                        <Column field="pre_count" header={t('Premium')}></Column>
                        <Column field="pro_count" header={t('Products')}></Column>
                        <Column field="total" header={t('Total Sales')}></Column>
                    </DataTable>
                </div>
                {
                    this.state.financeCartype.length > 0 ? (
                        <FinanceModal financeData={this.state.financeCartype} ref={this.financeRef} />
                    ) : null
                }
            </div>
        );
    }
}

export default withTranslation()(withRouter(FinanceModule));
