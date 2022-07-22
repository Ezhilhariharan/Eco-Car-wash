import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { withTranslation } from 'react-i18next';
import { getCarTypeList, getServices } from "./api/GET";
import { deleteService } from "./api/DELETE";

import CarType from "./components/cartype/CarType";
import DataTabled from "./components/datatable/DataTabled";
import CreateCarType from "./components/modals/CreateCarType";
import CreateService from "./components/modals/CreateService";
import EditService from "./components/modals/EditService";

import "./styles/ServiceLayout.scss";

class ServiceLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            carList: [],
            carType: "",
            editServiceID: "",
            serviceType: "Interior",
            standardServices: [],
            premiumServices: [],
            createService: false,
            openService: false
        };
        this.changeCarType = this.changeCarType.bind(this);
        this.updateCarTypeList = this.updateCarTypeList.bind(this);
        this.getServiceData = this.getServiceData.bind(this);
        this.getStandardServices = this.getStandardServices.bind(this);
        this.getPremiumServices = this.getPremiumServices.bind(this);
        this.editServiceData = this.editServiceData.bind(this);
        this.deleteServiceData = this.deleteServiceData.bind(this);
        this.resetEditId = this.resetEditId.bind(this);
        this.openModal = this.openModal.bind(this);
        this.openCarModal = this.openCarModal.bind(this);
        this.standardChild = React.createRef();
        this.premiumChild = React.createRef();
        this.updateChild = React.createRef();
        this.carTypeChild = React.createRef();
    }

    componentDidMount() {
        this.props.toggleMenu();
        getCarTypeList()
            .then((res) => {
                if (res.data.Status) {
                    console.log("getCarTypeList", res.data.Data);
                    this.setState({ carList: res.data.Data.filter((item) => item.status == "active") });
                    this.changeCarType(res.data.Data[0]?.id);
                    this.getServiceData();
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }
    componentWillUnmount() {
        this.props.toggleMenu();
    }

    updateCarTypeList() {
        getCarTypeList()
            .then((res) => {
                this.setState({ carList: res.data.Data });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    getServiceData(type = "") {
        this.setState({ editServiceID: "" });
        if (type === "Standard") {
            this.getStandardServices();
        } else if (type === "Premium") {
            this.getPremiumServices();
        } else {
            this.getStandardServices();
            this.getPremiumServices();
        }
    }

    resetEditId() {
        this.setState({ editServiceID: "" });
    }

    getStandardServices() {
        getServices(this.state.carType, this.state.serviceType, "Standard")
            .then((res) => {
                // console.log('services', res.data);
                this.setState({ standardServices: res.data.Data });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    getPremiumServices() {
        getServices(this.state.carType, this.state.serviceType, "Premium")
            .then((res) => {
                // console.log('services', res.data);
                this.setState({ premiumServices: res.data.Data });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            (prevState.carType !== "" &&
                prevState.carType !== this.state.carType) ||
            prevState.serviceType !== this.state.serviceType
        ) {
            this.getServiceData();
        }
        // if (this.state.editServiceID !== "") {
        //     this.updateChild.current.showModal();
        // }
    }

    changeCarType(value) {
        this.setState({ carType: value });
    }

    openModal(type) {
        this.setState({ openService: true }, () => {
            if (type === "Standard") {
                this.standardChild.current.showModal();
            } else {
                this.premiumChild.current.showModal();
            }
        }
        )
    }
    closeServiceModal = () => {

        this.setState({ openService: false })
    }

    openCarModal() {
        this.setState({ createService: true }, () =>
            this.carTypeChild.current.showModal());
    }

    editServiceData(id) {
        // console.log("cool");
        this.setState({ editServiceID: id }, () =>
            this.updateChild.current.showModal());
    }

    deleteServiceData(id, type) {
        if (window.confirm("Do you want to delete this service?")) {
            deleteService(id)
                .then((res) => {
                    console.log(res);
                    this.getServiceData(type);
                })
                .catch((err) => console.log(err));
        }
    }
    closeModal = () => {
        this.setState({ createService: false });
    }
    render() {
        // console.log("carType", this.state.carList, this.state.carType, this.state.serviceType);
        const { t } = this.props
        return (
            <div className="service-config-layout">
                <div className="service-config-layout-header">
                    {t('Service Configuration')}
                </div>
                <CarType
                    carList={this.state.carList}
                    carType={this.state.carType}
                    changeCarType={this.changeCarType}
                    openCarModal={this.openCarModal}
                />

                <div className="service-config-body">
                    <div className="service-config-body-header">
                        <div className="service-config-body-header-title">
                            {t(' Service Types')}
                        </div>
                        <button
                            className={`service-config-body-header-tabs mx-auto ${this.state.serviceType === "Interior"
                                ? "active"
                                : null
                                }`}
                            onClick={() => {
                                this.setState({ serviceType: "Interior" });
                            }}
                        >
                            {t('Interior')}
                        </button>
                        <button
                            className={`service-config-body-header-tabs mx-auto ${this.state.serviceType === "Exterior"
                                ? "active"
                                : null
                                }`}
                            onClick={() => {
                                this.setState({ serviceType: "Exterior" });
                            }}
                        >
                            {t('Exterior')}
                        </button>
                    </div>
                    <div className="service-config-body-body">
                        <div className="service-config-body-standard">
                            {this.state.carType !== "" ? (
                                <DataTabled
                                    serviceData={this.state.standardServices}
                                    serviceNature={"Standard"}
                                    openModal={this.openModal}
                                    editServiceData={this.editServiceData}
                                    deleteServiceData={this.deleteServiceData}
                                    carlistLength={this.state.carList}
                                />
                            ) : null}
                        </div>
                        <div className="service-config-body-premium">
                            {this.state.carType !== "" ? (
                                <DataTabled
                                    serviceData={this.state.premiumServices}
                                    serviceNature={"Premium"}
                                    openModal={this.openModal}
                                    editServiceData={this.editServiceData}
                                    deleteServiceData={this.deleteServiceData}
                                    carlistLength={this.state.carList}
                                />
                            ) : null}
                        </div>
                    </div>
                </div>
                {this.state.CarType !== "" && this.state.openService ? (
                    <>
                        <CreateService
                            serviceType={this.state.serviceType}
                            serviceNature={"Standard"}
                            carType={this.state.carType}
                            ref={this.standardChild}
                            getServiceData={this.getServiceData}
                            closeModal={this.closeServiceModal}
                        />
                        <CreateService
                            serviceType={this.state.serviceType}
                            serviceNature={"Premium"}
                            carType={this.state.carType}
                            ref={this.premiumChild}
                            getServiceData={this.getServiceData}
                            closeModal={this.closeServiceModal}
                        />
                    </>
                ) : null}

                {this.state.editServiceID ? (
                    <EditService
                        ref={this.updateChild}
                        getServiceData={this.getServiceData}
                        editServiceID={this.state.editServiceID}
                        resetEditId={this.resetEditId}
                    />
                ) : null}
                {
                    this.state.createService ?
                        <CreateCarType
                            ref={this.carTypeChild}
                            updateCarTypeList={this.updateCarTypeList}
                            closeModal={this.closeModal}
                        /> : null
                }

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
)(withRouter(ServiceLayout)));
