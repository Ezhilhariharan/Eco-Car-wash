import React, { Component } from "react";
import { connect } from "react-redux";
import { NavLink, withRouter } from "react-router-dom";
import { GetCreateCarType } from "./api/GET";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "./styles/CarTypeCreation.scss";
import CreateCarType from "../service/components/modals/CreateCarType";
// import UpdateLeaveConfig from "../leave/modals/UpdateLeaveConfig";
import EditCarType from "./modals/EditCarType";
import { DeleteCarTypes } from "./api/DELETE";
import axios from "axios";
import { withTranslation } from 'react-i18next';

let url;
class CarTypeCreation extends Component {
    constructor(props) {
        super(props);
        url = this.props.match.url;
        this.state = {
            getCreatedata: [],
            editLeave: "",
            carmake: "",
            createService: false,
        };
        this.getCreateCarTypeDatas = this.getCreateCarTypeDatas.bind(this);
        this.carTypeChild = React.createRef();
        this.updateChild = React.createRef();
        this.openCarModal = this.openCarModal.bind(this);
        this.editLeaveData = this.editLeaveData.bind(this);
        this.actionTemplate = this.actionTemplate.bind(this);
        this.resetEditData = this.resetEditData.bind(this);
        this.statusTemplate = this.statusTemplate.bind(this);
        // console.log("receivedd this datas", this.editLeave);
        this.dummeyId = React.createRef();
        this.carmakesidset = this.carmakesidset.bind(this);
    }

    componentDidMount() {
        this.props.toggleMenu();
        this.getCreateCarTypeDatas();
    }

    openCarModal() {
        this.setState({ createService: true }, () =>
            this.carTypeChild.current.showModal());
    }

    editLeaveData(id) {
        console.log("id", id);
        this.setState({ editLeave: id }, () =>
            this.updateChild.current.showModal());
    }

    carmakesidset(rowData) {
        this.setState({ carmake: rowData.id });
    }

    getCreateCarTypeDatas() {
        GetCreateCarType()
            .then((res) => {
                console.log("received kalai datas", res.data.Data); //checked
                this.setState({ getCreatedata: res.data.Data });
                // alert("welcome");
            })
            .catch((err) => {
                console.log("oder data", err);
            });
    }

    changeStatus(i) {
        console.log(i);
        let newServices = [...this.state.getCreatedata];
        // console.log(newServices);
        if (newServices[i].status === "active") {
            newServices[i].status = "inactive";
        } else if (newServices[i].status === "inactive") {
            newServices[i].status = "active";
        }
        let formData = new FormData();
        formData.append("status", newServices[i].status);
        axios
            .patch(`/admin/manage_cartype/${newServices[i].id}/`, formData)
            .then(
                (res) => {
                    // setServices(newServices);
                    console.log("updateService", res);
                },
                (err) => console.log(err)
            );
        this.setState({ getCreatedata: newServices });
    }

    statusTemplate(rowData) {
        // console.log(rowData);
        let i = this.state.getCreatedata.indexOf(rowData);
        // console.log(i);
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

    carMakes(rowData) {
        return (
            <NavLink
                to={`/configuration/cartype/${rowData.id}`}
                className="btn-navy-circle mx-auto"
                style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    fontSize: "1.5em",
                }}
            >
                <i className="fas fa-chevron-right"></i>
            </NavLink>
        );
    }

    actionTemplate(rowData) {
        return (
            <React.Fragment>
                <div className="d-flex flex-row align-items-center justify-content-center">
                    <i
                        style={{ fontSize: "15px" }}
                        className="fas fa-pen me-3"
                        onClick={() => this.editLeaveData(rowData.id)}
                    ></i>
                    <i
                        style={{ fontSize: "15px" }}
                        className="fas fa-trash"
                        onClick={() => this.deleteLeaveData(rowData.id)}
                    ></i>
                </div>
            </React.Fragment>
        );
    }

    deleteLeaveData(id) {
        if (window.confirm("Do you want to delete this leave ")) {
            DeleteCarTypes(id)
                .then((res) => {
                    this.getCreateCarTypeDatas();
                })
                .catch((err) => console.log(err));
        }
    }

    // componentDidUpdate(prevProps, prevState) {
    //     if (this.state.editLeave !== "") {
    //         this.updateChild.current.showModal();
    //     }
    // }

    resetEditData() {
        this.setState({ editLeave: "" });
    }

    componentWillUnmount() {
        this.props.toggleMenu();
    }
    closeModal = () => {
        this.setState({ createService: false });
    }
    render() {
        const { t } = this.props
        return (
            <div className="car-type-layout">
                <div className="car-type-header ms-3">
                    <h3 className="car-type-title pb-4">{t('Car Type')}</h3>
                    <button
                        className="btn-navy"
                        onClick={() => this.openCarModal()}
                    >
                        {t('Add')} +
                    </button>
                </div>
                <div
                    className="car-type-list"
                    style={{ height: "calc(100%-3.3rem)" }}
                    emptyMessage={t('No Record Found')}
                >
                    <DataTable
                        value={this.state.getCreatedata}
                        scrollable
                        scrollHeight="100%"
                    >
                        <Column field="name" header={t('Name')}></Column>
                        <Column
                            field="description"
                            header={t('Description')}
                        ></Column>
                        <Column
                            field="status"
                            header={t('Status')}
                            body={this.statusTemplate}
                        ></Column>
                        <Column
                            field="action"
                            header={t('Actions')}
                            body={this.actionTemplate}
                        ></Column>
                        <Column
                            field="id"
                            header={t('Car Make')}
                            body={this.carMakes}
                        ></Column>
                    </DataTable>
                </div>
                {/* <CarLayout className="d-none" style={{ display: "none" }} /> */}
                {
                    this.state.createService ?
                        <CreateCarType
                            ref={this.carTypeChild}
                            updateCarTypeList={this.getCreateCarTypeDatas}
                            closeModal={this.closeModal}
                        /> : null}
                {this.state.editLeave !== "" ? (
                    <EditCarType
                        // getLeaveConfig={this.getLeaveConfig}
                        editLeave={this.state.editLeave}
                        ref={this.updateChild}
                        updateCarTypeList={this.getCreateCarTypeDatas}
                        resetEditData={this.resetEditData}
                        editLeaveData={this.editLeaveData}
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
)(withRouter(CarTypeCreation)));
