import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { connect } from "react-redux";
import { withTranslation } from 'react-i18next';
import { getCouponList } from "./api/GET";
import { deleteCouponData } from "./api/DELETE";
import { updateCouponData } from "./api/PATCH";

import CreateCoupon from "./modals/CreateCoupon";
import EditCoupon from "./modals/EditCoupon";

import "./styles/Coupons.scss";

class Coupons extends Component {
    constructor(props) {
        super(props);
        this.state = {
            couponType: "General",
            editCoupon: "",
            couponList: [],
            openCreateCupon: false,
        };
        this.getCouponData = this.getCouponData.bind(this);
        this.changeStatus = this.changeStatus.bind(this);
        this.statusTemplate = this.statusTemplate.bind(this);
        this.actionTemplate = this.actionTemplate.bind(this);
        this.discountTemplate = this.discountTemplate.bind(this);
        this.editCouponData = this.editCouponData.bind(this);
        this.createModal = React.createRef();
        this.updateModal = React.createRef();
    }

    componentDidMount() {
        this.props.toggleMenu();
        this.getCouponData();
    }
    componentWillUnmount() {
        this.props.toggleMenu();
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevState.couponType !== this.state.couponType) {
            this.getCouponData();
        }

        // if (this.state.editCoupon !== "") {
        //     this.updateModal.current.showModal();
        // }
    }

    getCouponData() {
        getCouponList(this.state.couponType).then(
            (res) => {
                console.log(res.data.Data);
                this.setState({ editCoupon: "", couponList: res.data.Data });
            },
            (err) => console.log(err)
        );
    }

    editCouponData(id) {
        this.setState({ editCoupon: id }, () => this.updateModal.current.showModal());
    }
    reseteditCouponData() {
        this.setState({ editCoupon: "" });
    }
    discountTemplate(rowData) {
        return (
            <React.Fragment>
                <div className="">
                    {rowData.discount_type === "Percentage" ? (
                        <div>{rowData.discount_amount}%</div>
                    ) : (
                        <div>{rowData.discount_amount} CHF</div>
                    )}
                </div>
            </React.Fragment>
        );
    }

    changeStatus(i) {
        let couponList = this.state.couponList;
        if (couponList[i].status === "active") {
            couponList[i].status = "inactive";
        } else if (couponList[i].status === "inactive") {
            couponList[i].status = "active";
        }
        updateCouponData(couponList[i].id, {
            status: couponList[i].status,
        }).then(
            (res) => {
                this.setState({ couponList: couponList });
            },
            (err) => console.log(err)
        );
    }

    statusTemplate(rowData) {
        // console.log(rowData);
        let i = this.state.couponList.indexOf(rowData);
        return (
            <React.Fragment>
                <div className="d-flex flex-row justify-content-center">
                    <label className="customised-switch">
                        <input
                            type="checkbox"
                            checked={rowData.status === "active" ? true : false}
                            onChange={() => this.changeStatus(i)}
                        />
                        <span className="customised-slider customised-round"></span>
                    </label>
                </div>
            </React.Fragment>
        );
    }

    actionTemplate(rowData) {
        return (
            <React.Fragment>
                <div className="d-flex flex-row align-items-center justify-content-center">
                    <i
                        style={{ fontSize: "15px" }}
                        className="fas fa-pen me-3"
                        onClick={() => this.editCouponData(rowData.id)}
                    ></i>
                    <i
                        style={{ fontSize: "15px" }}
                        className="fas fa-trash"
                        onClick={() => {
                            if (
                                window.confirm(
                                    "Are you sure you want to delete?"
                                )
                            ) {
                                deleteCouponData(rowData.id)
                                    .then((res) => {
                                        this.getCouponData();
                                    })
                                    .catch((err) => console.log(err));
                            }
                        }}
                    ></i>
                </div>
            </React.Fragment>
        );
    }
    openModal = () => {
        this.setState({ openCreateCupon: true }, () => this.createModal.current.showModal())
    }
    closeModal = () => {
        this.setState({ openCreateCupon: false })
    }
    render() {
        const { t } = this.props
        return (
            <div className="coupons-layout">
                <div className="coupons-layout-title">{t('Coupons')}</div>
                <div className="coupon-type-specification">
                    <div
                        className={`coupon-type-card ${this.state.couponType === "General"
                            ? "active"
                            : null
                            }`}
                        onClick={() => this.setState({ couponType: "General" })}
                    >
                        {t('General')}
                    </div>
                    <div
                        className={`coupon-type-card ${this.state.couponType === "Specific"
                            ? "active"
                            : null
                            }`}
                        onClick={() =>
                            this.setState({ couponType: "Specific" })
                        }
                    >
                        {t('Specific')}
                    </div>
                    <button
                        className="btn-white ms-auto"
                        onClick={
                            this.openModal
                        }
                    >
                        {t('Add')} +
                    </button>
                </div>
                <div className="coupon-list">
                    <DataTable
                        value={this.state.couponList}
                        scrollable
                        scrollHeight="100%"
                        emptyMessage={t('No Record Found')}
                    >
                        <Column field="code" header={t('Coupon Code')}></Column>
                        <Column
                            field="description"
                            header={t('Description')}
                        ></Column>
                        <Column
                            field="discount_amount"
                            header={t('Discount')}
                            body={this.discountTemplate}
                        ></Column>
                        <Column field="categories" header={t('Category')}></Column>
                        {this.state.couponType === "Specific" ? (
                            <Column field="user" header={t('User')}></Column>
                        ) : null}
                        <Column
                            field="id"
                            header={t('Status')}
                            body={this.statusTemplate}
                        ></Column>
                        <Column
                            field="id"
                            header={t('Action')}
                            body={this.actionTemplate}
                        ></Column>
                    </DataTable>
                </div>
                {
                    this.state.openCreateCupon ?
                        <CreateCoupon
                            couponType={this.state.couponType}
                            getCouponData={this.getCouponData}
                            ref={this.createModal}
                            closeModal={this.closeModal}
                        /> : null
                }

                {this.state.editCoupon !== "" ? (
                    <EditCoupon
                        couponType={this.state.couponType}
                        getCouponData={this.getCouponData}
                        editCoupon={this.state.editCoupon}
                        editCouponData={this.reseteditCouponData}
                        ref={this.updateModal}
                    />
                ) : null}
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
)(withRouter(Coupons)));
// export default withRouter(Coupons)
