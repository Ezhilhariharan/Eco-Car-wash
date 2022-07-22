import React, { Component, createRef } from "react";
import { withRouter } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { connect } from "react-redux";
import * as yup from "yup";
import Errormodal from "../../../common_component/errormodal/Errormodal";
import { withTranslation } from 'react-i18next';
import { getLeaveConfigs, getLeaveCount } from "./api/GET";
import { createLeaveCount } from "./api/POST";
import { updateLeaveStatus, updateLeaveCount } from "./api/PATCH";
import { DeleteLeaveConfig } from "./api/DELETE";

import CreateLeaveConfig from "./modals/CreateLeaveConfig";
import UpdateLeaveConfig from "./modals/UpdateLeaveConfig";

import "./styles/LeaveConfig.scss";

const number = /^[1-9]{1,9}$/;
const validationSchema = yup.object().shape({
    manager_count: yup
        .string().matches(number, "number is not valid")
        .required("Required"),

});
const validationSchema_Cleaner = yup.object().shape({
    cleaner_count: yup
        .string().matches(number, "number is not valid")
        .required("Required"),
});
class LeaveConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {
            leaveConfigs: [],
            editLeave: "",
            managerLeaveCount: "",
            cleanerLeaveCount: "",
            managerLeaveID: "",
            cleanerLeaveID: "",
            errorMsg: "",
            openLeave: false,
            editModal: false,
        };
        this.getLeaveConfig = this.getLeaveConfig.bind(this);
        this.actionTemplate = this.actionTemplate.bind(this);
        this.statusTemplate = this.statusTemplate.bind(this);
        this.getLeaveCountData = this.getLeaveCountData.bind(this);
        this.editLeaveData = this.editLeaveData.bind(this);
        this.createChild = createRef();
        this.updateChild = createRef();
        this.Errormodalref = React.createRef();
    }
    componentDidMount() {
        this.props.toggleMenu();
        this.getLeaveConfig();
        this.getLeaveCountData();
    }
    componentWillUnmount() {
        this.props.toggleMenu();
    }
    getLeaveConfig() {
        getLeaveConfigs()
            .then((res) => {
                // console.log("leaveConfigs", res);
                this.setState({ editLeave: "" });
                this.setState({ leaveConfigs: res.data.Data });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    getLeaveCountData() {
        getLeaveCount()
            .then((res) => {
                console.log("getLeaveCountData", res.data.Data);
                res.data.Data.forEach((data) => {
                    if (data.user_type === 2) {
                        this.setState({
                            managerLeaveCount: data.leave_count,
                            managerLeaveID: data.id,
                        });
                    }
                    if (data.user_type === 3) {
                        this.setState({
                            cleanerLeaveCount: data.leave_count,
                            cleanerLeaveID: data.id,
                        });
                    }
                });
            })
            .catch((err) => console.log(err));
    }

    changeStatus(i) {
        let leaveConfigs = this.state.leaveConfigs;
        if (leaveConfigs[i].status === "active") {
            leaveConfigs[i].status = "inactive";
        } else if (leaveConfigs[i].status === "inactive") {
            leaveConfigs[i].status = "active";
        }
        updateLeaveStatus(leaveConfigs[i].id, {
            status: leaveConfigs[i].status,
        }).then(
            (res) => {
                this.setState({ leaveConfigs: leaveConfigs });
            },
            (err) => console.log(err)
        );
    }

    statusTemplate(rowData) {
        // console.log(rowData);
        let i = this.state.leaveConfigs.indexOf(rowData);
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

    editLeaveData(id) {
        this.setState({ editLeave: id, editModal: true }, () => this.updateChild.current.showModal());
    }

    deleteLeaveData(id) {
        if (window.confirm("Do you want to delete this leave config")) {
            DeleteLeaveConfig(id)
                .then((res) => {
                    this.getLeaveConfig();
                })
                .catch((err) => console.log(err));
        }
    }

    openModal = () => {
        this.setState({ openLeave: true }, () => this.createChild.current.showModal());
    }
    closeModal = () => {
        this.setState({ openLeave: false });
    }
    EditcloseModal = () => {
        this.setState({ editModal: false });
    }
    managerUpdateStatus = () => {
        this.props.showtoast({
            text: "Manager leave count updated",
            time: new Date().getTime(),
        });
    };
    cleanerUpdateStatus = () => {
        this.props.showtoast({
            text: "Cleaner leave count updated",
            time: new Date().getTime(),
        });
    };
    managerCreateStatus = () => {
        this.props.showtoast({
            text: "Manager leave count Created",
            time: new Date().getTime(),
        });
    };
    cleanerCreateStatus = () => {
        this.props.showtoast({
            text: "Cleaner leave count Created",
            time: new Date().getTime(),
        });
    };
    render() {
        const { t } = this.props
        return (
            <div className="leaves-layout">
                <div className="leaves-title">{t('Leave Configurations')}</div>
                <div className="leaves-add">
                    <div className="leave-count">
                        <div className="leave-count-title">
                            {t('Leave')} <br /> {t('Count')}
                        </div>
                        <div className="leave-count-form ms-5 d-flex flex-row">
                            <div className="col-6">
                                <Formik
                                    initialValues={{
                                        manager_count: this.state.managerLeaveCount,
                                    }}
                                    enableReinitialize={true}
                                    validationSchema={validationSchema}
                                    onSubmit={(values, onSubmitProps) => {
                                        // console.log(values);

                                        if (this.state.managerLeaveID !== "") {
                                            let data = {
                                                leave_count: values.manager_count,
                                            };
                                            // console.log("managerLeaveID -- updateLeaveCount");
                                            updateLeaveCount(
                                                this.state.managerLeaveID,
                                                data
                                            )
                                                .then((res) => {
                                                    if (res.data.Status) {
                                                        this.setState({
                                                            managerLeaveCount:
                                                                values.manager_count,
                                                        });
                                                        this.managerUpdateStatus()
                                                    } else {
                                                        this.setState({ errorMsg: res.data.Message })
                                                        this.Errormodalref.current.showModal()
                                                    }
                                                })
                                                .catch((error) => {
                                                    console.log(error)
                                                    if (!error.response.data.Status) {
                                                        if (error.response.data.hasOwnProperty('Message')) {
                                                            this.setState({ errorMsg: error.response.data.Message })
                                                            this.Errormodalref.current.showModal()
                                                        }
                                                    }
                                                });
                                        } else {
                                            // console.log("managerLeaveID -- createLeaveCount");
                                            let data = {
                                                user_type: 2,
                                                leave_count: values.manager_count,
                                            };
                                            createLeaveCount(data)
                                                .then((res) => {
                                                    if (res.data.Status) {
                                                        this.setState({
                                                            managerLeaveCount:
                                                                values.manager_count,
                                                        });
                                                        this.managerCreateStatus()
                                                    } else {
                                                        this.setState({ errorMsg: res.data.Message })
                                                        this.Errormodalref.current.showModal()
                                                    }
                                                })
                                                .catch((error) => {
                                                    console.log(error)
                                                    if (!error.response.data.Status) {
                                                        if (error.response.data.hasOwnProperty('Message')) {
                                                            this.setState({ errorMsg: error.response.data.Message })
                                                            this.Errormodalref.current.showModal()
                                                        }
                                                    }
                                                });
                                        }


                                    }}
                                >
                                    <Form id="createLeaveCountForm " >
                                        <div className="d-flex flex-row">
                                            <div className=" mb-3">
                                                <label
                                                    className="label"
                                                    htmlFor="manager_count"
                                                >
                                                    {t('Manager Leave Count')}
                                                </label>
                                                <Field
                                                    id="manager_count"
                                                    name="manager_count"
                                                    type="text"
                                                    className="form-control"
                                                    maxLength={3}
                                                />
                                                <div className="text-danger">
                                                    <ErrorMessage name="manager_count" />
                                                </div>
                                            </div>

                                            <div className="ms-4">
                                                {this.state.managerLeaveCount ===
                                                    "" ?
                                                    (
                                                        <button
                                                            className="btn-navy mt-4"
                                                            type="submit"
                                                        >
                                                            {t('Create')}
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className="btn-navy mt-4"
                                                            type="submit"
                                                        >
                                                            {t('Update')}
                                                        </button>
                                                    )}
                                            </div>
                                        </div>
                                    </Form>
                                </Formik>
                            </div>
                            <div className="col-6">
                                <Formik
                                    initialValues={{
                                        cleaner_count: this.state.cleanerLeaveCount,
                                    }}
                                    enableReinitialize={true}
                                    validationSchema={validationSchema_Cleaner}
                                    onSubmit={(values, onSubmitProps) => {

                                        if (this.state.cleanerLeaveID !== "") {
                                            console.log("cleanerLeaveID -- updateLeaveCount");
                                            let data = {
                                                leave_count: values.cleaner_count,
                                            };
                                            updateLeaveCount(
                                                this.state.cleanerLeaveID,
                                                data
                                            )
                                                .then((res) => {
                                                    if (res.data.Status) {
                                                        this.setState({
                                                            cleanerLeaveCount:
                                                                values.cleaner_count,
                                                        });
                                                        this.cleanerUpdateStatus()
                                                    } else {
                                                        this.setState({ errorMsg: res.data.Message })
                                                        this.Errormodalref.current.showModal()
                                                    }
                                                })
                                                .catch((error) => {
                                                    console.log(error)
                                                    if (!error.response.data.Status) {
                                                        if (error.response.data.hasOwnProperty('Message')) {
                                                            this.setState({ errorMsg: error.response.data.Message })
                                                            this.Errormodalref.current.showModal()
                                                        }
                                                    }
                                                });
                                        } else {
                                            console.log("cleanerLeaveID -- createLeaveCount");
                                            let data = {
                                                user_type: 3,
                                                leave_count: values.cleaner_count,
                                            };
                                            createLeaveCount(data)
                                                .then((res) => {
                                                    if (res.data.Status) {
                                                        this.setState({
                                                            cleanerLeaveCount:
                                                                values.cleaner_count,
                                                        });
                                                        this.cleanerCreateStatus()
                                                    } else {
                                                        this.setState({ errorMsg: res.data.Message })
                                                        this.Errormodalref.current.showModal()
                                                    }
                                                })
                                                .catch((error) => {
                                                    if (!error.response.data.Status) {
                                                        if (error.response.data.hasOwnProperty('Message')) {
                                                            this.setState({ errorMsg: error.response.data.Message })
                                                            this.Errormodalref.current.showModal()
                                                        }
                                                    }
                                                });
                                        }
                                    }}
                                >
                                    <Form id="createLeaveCountForm">
                                        <div className="d-flex flex-row">
                                            <div className=" mb-3">
                                                <label
                                                    className="label"
                                                    htmlFor="cleaner_count"
                                                >
                                                    {t('Cleaner Leave Count')}
                                                </label>
                                                <Field
                                                    id="cleaner_count"
                                                    name="cleaner_count"
                                                    type="text"
                                                    className="form-control"
                                                    maxLength={3}
                                                />
                                                <div className="text-danger">
                                                    <ErrorMessage name="cleaner_count" />
                                                </div>
                                            </div>
                                            <div className="ms-4">
                                                {this.state.managerLeaveCount ===
                                                    "" &&
                                                    this.state.cleanerLeaveCount ===
                                                    "" ? (
                                                    <button
                                                        className="btn-navy mt-4"
                                                        type="submit"
                                                    >
                                                        {t('Create')}
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="btn-navy mt-4"
                                                        type="submit"
                                                    >
                                                        {t('Update')}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </Form>
                                </Formik>
                            </div>

                        </div>
                    </div>
                    <button
                        className="btn-white"
                        style={{ maxWidth: "5rem" }}
                        onClick={this.openModal}
                    >
                        + {t('Add')}
                    </button>
                </div>

                <div className="leaves-list">
                    <DataTable
                        value={this.state.leaveConfigs}
                        scrollable
                        scrollHeight="100%"
                        emptyMessage={t('No Record Found')}
                    >
                        <Column field="name" header={t('Name')}></Column>
                        <Column
                            field="description"
                            header={t('Description')}
                        ></Column>
                        <Column field="date" header="Date"></Column>
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
                {this.state.openLeave ?
                    <CreateLeaveConfig
                        getLeaveConfig={this.getLeaveConfig}
                        ref={this.createChild}
                        closeModal={this.closeModal}
                    /> : null}
                {this.state.editLeave !== "" && this.state.editModal ? (
                    <UpdateLeaveConfig
                        getLeaveConfig={this.getLeaveConfig}
                        editLeave={this.state.editLeave}
                        ref={this.updateChild}
                        editLeaveData={this.editLeaveData}
                        closeModal={this.EditcloseModal}
                    />
                ) : null}
                <Errormodal ref={this.Errormodalref} message={this.state.errorMsg} />
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
        showtoast: (data) => {
            dispatch({ type: "ShowToast", text: data.text, time: data.time });
        },
        toggleMenu: () => {
            dispatch({ type: "NAV_MENU" });
        },
    };
};

export default withTranslation()(connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(LeaveConfig)));
// export default withRouter(LeaveConfig)
