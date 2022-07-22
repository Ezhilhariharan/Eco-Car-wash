import React, { Component } from "react";
import { connect } from "react-redux";
import { NavLink, withRouter } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import axios from "axios";
import CarAddMakes from "./modals/CarAddMakes";
import CarEditMakes from "./modals/CarEditMakes";
import { getCarMakeData } from "./api/GET";
import { DeleteCarMakeData } from "./api/DELETE";
import { withTranslation } from 'react-i18next';
let id;
class CarLayout extends Component {
    constructor(props) {
        super(props);

        this.state = {
            getCreatedata: [],
            editLeave: "",
            addCarMake: false,
            editCarMake: false,
        };
        this.getCreateCarTypeDatas = this.getCreateCarTypeDatas.bind(this);
        this.carTypeChild = React.createRef();
        this.updateChild = React.createRef();

        this.editLeaveData = this.editLeaveData.bind(this);
        this.actionTemplate = this.actionTemplate.bind(this);
        this.resetEditData = this.resetEditData.bind(this);
        this.statusTemplate = this.statusTemplate.bind(this);

        // console.log("receivedd this datas", this.editLeave);
        this.dummeyId = React.createRef();
        id = this.props.match.params.id;
    }

    componentDidMount() {
        this.props.toggleMenu();
        this.getCreateCarTypeDatas();
        this.carmakeId();
        // console.log("id-COOL", id);
    }

    openCarModal() {
        this.setState({ addCarMake: true }, () => this.carTypeChild.current.showModal())
    }
    closeModal = () => {
        // console.log("close");
        this.setState({ addCarMake: false })
    }
    closeEditModal = () => {
        // console.log("close");
        this.setState({ editCarMake: false })
    }
    editLeaveData(id) {
        this.setState({ editLeave: id, editCarMake: true }, () => this.updateChild.current.showModal());
    }
    carmakeId() {
        this.setState({ carmakeid: id });
    }
    getCreateCarTypeDatas() {
        getCarMakeData(id)
            .then((res) => {
                console.log("received kalai datas", res.data.Data); //checked
                this.setState({ getCreatedata: res.data.Data });
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
            .patch(`/admin/manage_carmake/${newServices[i].id}/`, formData)
            .then(
                (res) => {
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
    carModelData(rowData) {
        return (
            <NavLink
                to={`/configuration/cartype/carmodel/${rowData.id}`}
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
            DeleteCarMakeData(id)
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
        this.setState({ editLeave: "", getCreatedata: [] }, () => {
            this.getCreateCarTypeDatas();
        });
    }

    componentWillUnmount() {
        this.props.toggleMenu();
    }

    render() {
        console.log("90000", this.state.getCreatedata);
        const { t } = this.props
        return (
            <div className="car-type-layout">
                <div className="w-100 d-flex flex-row justify-content-between">
                    <div className="mt-2 mb-3 ms-2 d-flex">
                        <button
                            className="btn-navy-circle"
                            style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                fontSize: "1.5em",
                            }}
                            onClick={() =>
                                this.props.history.push("/configuration/cartype")
                            }
                        >
                            {" "}
                            <i className="fas fa-chevron-left"></i>
                        </button>
                        <h3 className="car-type-title pb-4 ms-3 mt-1">
                            {t('Car Make')}
                        </h3>
                    </div>
                    <div
                        className="car-type-header ms-3"
                        style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                        <button
                            className="btn-navy"
                            onClick={() => this.openCarModal()}
                        >
                            {t('Add')} +
                        </button>
                        {/* <CarAddMakes id={this.state.carmakeid} /> */}
                    </div>
                </div>

                <div
                    className="car-type-list"
                    style={{ height: "calc(100%-3.3rem)" }}
                >
                    <DataTable
                        value={this.state.getCreatedata}
                        scrollable
                        scrollHeight="100%"
                        emptyMessage={t('No Record Found')}
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
                            header={t('Car Model')}
                            body={this.carModelData}
                        ></Column>
                    </DataTable>
                </div>
                {
                    this.state.addCarMake ? <CarAddMakes
                        ref={this.carTypeChild}
                        updateCarTypeList={this.updateCarTypeList}
                        refresh={this.resetEditData}
                        id={id}
                        closeModal={this.closeModal}
                    /> : null
                }


                {this.state.editLeave !== "" && this.state.editCarMake ? (
                    <CarEditMakes
                        editLeave={this.state.editLeave}
                        ref={this.updateChild}
                        resetEditData={this.resetEditData}
                        editLeaveData={this.editLeaveData}
                        closeModal={this.closeEditModal}
                        id={id}
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
)(withRouter(CarLayout)));
