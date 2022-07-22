import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { getGiftCoupons } from "./api/GET";
import { withTranslation } from 'react-i18next';
class GiftCoupons extends Component {
    constructor(props) {
        super(props);
        this.state = {
            giftData: [],
            page: 1,
            lock: true,
        };
        this.getGiftData = this.getGiftData.bind(this);
        this.scrollLoader = this.scrollLoader.bind(this);
    }

    componentDidMount() {
        this.props.toggleMenu();
        this.getGiftData();
        this.scrollLoader();
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
                (scrollerBody.clientHeight - scroller.clientHeight) * 0.9
            ) {
                if (!this.state.lock && this.state.giftData.next) {
                    this.setState({ lock: true }, () => {
                        this.setState({ page: this.state.page + 1 }, () => {
                            this.getGiftData();
                        });
                    });
                }
            }
        });
    }
    componentWillUnmount() {
        this.props.toggleMenu();
    }

    getGiftData(reset = false) {
        let list
        getGiftCoupons(this.state.page).then(
            (res) => {
                console.log(res.data.Data);
                // this.setState({ giftData: res.data.Data });
                if (Object.keys(this.state.giftData).length != 0 && !reset) {
                    list = this.state.giftData.results;
                    list.push(...res.data.Data.results);
                    res.data.Data.results = list;
                    // console.log(res.data.Data);
                    this.setState({ giftData: res.data.Data });
                } else {
                    this.setState({ giftData: res.data.Data });
                }
                this.setState({ lock: false });
            },
            (err) => console.log(err)
        );
    }
    actionTemplate = (rowData) => {
        return (
            rowData.status == "active" ? "Active" : "Expired"
        )
    }
    render() {
        // console.log("giftData", this.state.giftData.results);
        const { t } = this.props
        return (
            <div className="coupons-layout">
                <div className="coupons-layout-title pb-4">{t('Gift Coupons')}</div>
                <div
                    className="coupon-list"
                    style={{ height: "calc(100% - 3.3rem)" }}
                >
                    <DataTable
                        value={this.state.giftData.results}
                        scrollable
                        scrollHeight="100%"
                        emptyMessage={t('No Record Found')}
                    >
                        <Column field="code" header={t('Code')}></Column>
                        <Column field="amount" header={t('Amount')}></Column>
                        <Column field="name" header={t('Name')}></Column>
                        <Column field="email" header={t('Email')}></Column>
                        <Column field="phone" header={t('Phone')}></Column>
                        <Column field="status" header={t('Status')} body={this.actionTemplate}></Column>
                        <Column
                            field="created_by.name"
                            header={t('Booking')}
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
            dispatch({ type: "NAV_MENU" });
        },
    };
};

export default withTranslation()(connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(GiftCoupons)));
