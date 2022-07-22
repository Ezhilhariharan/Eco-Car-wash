import React, { Component } from "react";
import { withRouter, NavLink } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import EditGarage from "../modals/EditGarage"
import axios from "axios";
import Errormodal from "../../../common_component/errormodal/Errormodal";
import { withTranslation } from 'react-i18next';
import { getGarageData, getGarageAppointmentList } from "../../api/GET";

import "./styles/GarageView.scss";

let url, id;
class GarageView extends Component {
    constructor(props) {
        super(props);
        url = this.props.match.url;
        id = this.props.match.params.id;
        this.state = {
            garageUser: {},
            appointments: [],
            page: 1,
            lock: true,
            editModal: false,
            errorMsg: "",
        };
        this.getGarageUserData = this.getGarageUserData.bind(this);
        this.getGarageAppointmentData = this.getGarageAppointmentData.bind(this);
        this.loadGarageAppointment = this.loadGarageAppointment.bind(this);
        this.actionTemplate = this.actionTemplate.bind(this);
        this.invoiceTemplate = this.invoiceTemplate.bind(this);
        this.scrollLoader = this.scrollLoader.bind(this);
        this.createChild = React.createRef();
        this.Errormodalref = React.createRef();
    }

    componentDidMount() {
        this.getGarageUserData(id);
        this.getGarageAppointmentData(id);
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
                if (!this.state.lock && this.state.appointments.next) {
                    this.setState({ lock: true }, () => {
                        this.setState({ page: this.state.page + 1 }, () => {
                            this.getGarageAppointmentData(id);
                        });
                    });
                }
            }
        });
    }

    getGarageUserData(user_id) {
        getGarageData(user_id)
            .then((res) => {
                // console.log("again", res.data.Data);
                this.setState({ garageUser: res.data.Data });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    getGarageAppointmentData(user_id, reset = false) {
        getGarageAppointmentList(user_id, this.state.page)
            .then((res) => {
                console.log(res.data.Data);
                // this.setState({ appointments: res.data.Data });
                if (Object.keys(this.state.appointments).length != 0 && !reset) {
                    let list = this.state.appointments.results;
                    list.push(...res.data.Data.results);
                    res.data.Data.results = list;
                    // console.log(res.data.Data);
                    this.setState({ appointments: res.data.Data });
                } else {
                    this.setState({ appointments: res.data.Data });
                }
                this.setState({ lock: false });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    loadGarageAppointment(rowData) {
        // console.log(rowData);
        this.props.history.push(`/garage/appointment/${rowData.data.id}`);
    }
    generateInvoice = (rowData_id) => {
        axios
            .get(`/admin/manage_garage_appointments/get_invoice/?appointment=${rowData_id}`)
            .then((res) => {
                // console.log("generateInvoice", res);
                this.getGarageAppointmentData(id, true)
            })
            .catch((error) => {
                console.log(error);
                if (!error.response.data.Status) {
                    if (error.response.data.hasOwnProperty('Message')) {
                        this.setState({ errorMsg: error.response.data.Message })
                        this.Errormodalref.current.showModal()
                    }
                }
            });
    }
    downloadAction = (rowData) => {
        let formData = new FormData();
        formData.append("invoice_status", "Downloaded");
        axios
            .patch(`/admin/manage_garage_appointments/${rowData.id}/`, formData)
            .then((res) => {
                //   this.getGarageAppointmentData(id, true)
                // url = data.data;
                // const a = document.createElement('a');
                // a.style.display = 'none';
                // a.href = rowData.invoice?.invoice_file;
                // a.download = rowData.invoice?.invoice_number + '.pdf';
                // document.body.appendChild(a);
                // a.click();
                // window.URL.revokeObjectURL(res);
            })
            .catch((error) => {
                console.log(error);
                if (!error.response.data.Status) {
                    if (error.response.data.hasOwnProperty('Message')) {
                        this.setState({ errorMsg: error.response.data.Message })
                        this.Errormodalref.current.showModal()
                    }
                }
            });
    }
    invoiceTemplate(rowData) {
        console.log("Generated", rowData);
        if (rowData.invoice_status == "Generated") {
            console.log("Generated", rowData.invoice);
        }
        const { t } = this.props
        return (
            <React.Fragment>
                {
                    {
                        "Not_Generated":
                            <button
                                className="btn-navy"
                                style={{ width: "7rem" }}
                                disabled={rowData.appointment_status !== "Completed"}
                                onClick={() => this.generateInvoice(rowData.id)}>
                                {t('Generate')}
                            </button>,
                        "Generated":
                            <button
                                className="btn-navy"
                                style={{ width: "7rem" }}
                                download={`${rowData.invoice?.invoice_number}.pdf`}
                                target="_blank"
                                href={rowData.invoice?.invoice_file}
                                onClick={() => this.downloadAction(rowData)}
                            >
                                {t('Download')}
                            </button>
                    }[rowData.invoice_status]
                }
            </React.Fragment>
        )
    }

    actionTemplate(rowData) {
        // console.log(rowData);
        return (
            <React.Fragment>
                <div className="d-flex flex-row align-items-center justify-content-center">
                    <button
                        className="btn-navy-circle"
                        onClick={() => this.props.history.push(`/garage/appointment/${rowData.id}`)}
                        style={{ width: "30px", height: "30px" }}
                    >
                        <i className="fa fa-chevron-right"></i>
                    </button>
                </div>
            </React.Fragment>
        );
    }
    closeModal = () => {
        this.setState({ editModal: false })
    }
    render() {
        // console.log("this.state.garageUser", this.state.garageUser);
        const { t } = this.props
        return (
            <div className="garage-view-layout">
                <div className="garage-user-details">
                    <div className="garage-user-card pb-1 d-flex flex-row">
                        <NavLink
                            to="/garage"
                            className="btn-navy-circle mt-2 ms-2"
                        >
                            <i className="fas fa-chevron-left"></i>
                        </NavLink>
                        <button className="btn-navy-circle ms-2 mt-2"
                            onClick={() => this.setState({ editModal: true }, () => this.createChild.current.showModal())}>
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <div className="garage-user-image">
                            <div className="garage-profile-image">
                                <img
                                    src={this.state.garageUser.profile_image ? this.state.garageUser.profile_image : "https://picsum.photos/200"}
                                    alt="garage-profile-image"
                                />
                            </div>
                            <span className="name mt-2">
                                {this.state.garageUser?.name}
                            </span>
                            <span className="address ">
                                {this.state.garageUser?.address?.address}
                            </span>
                        </div>
                        <div className="garage-user-data">
                            <div className="user-data">
                                <span
                                    className="title"
                                    style={{
                                        fontWeight: "700",
                                        color: "#63666A",
                                    }}
                                >
                                    {t('Phone')}
                                </span>
                                <span className="data">
                                    {this.state.garageUser?.mobile_no}
                                </span>
                            </div>
                            <div className="user-data">
                                <span
                                    className="title"
                                    style={{
                                        fontWeight: "700",
                                        color: "#63666A",
                                    }}
                                >
                                    {t('Email')}
                                </span>
                                <span className="data">
                                    {this.state.garageUser?.email}
                                </span>
                            </div>
                            <div className="user-data">
                                <span
                                    className="title"
                                    style={{
                                        fontWeight: "700",
                                        color: "#63666A",
                                    }}
                                >
                                    {t('Description')}
                                </span>
                                <span className="data">
                                    {this.state.garageUser?.description}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="garage-user-navigation">
                        <NavLink
                            to={`/garage/service/${id}`}
                            className="garage-user-navigation-card"
                        >
                            <span
                                className="bg-secondary rounded"
                                style={{
                                    width: "50px",
                                    height: "85%",
                                }}
                            ></span>
                            <span className="mx-auto">{t('Service Config')}</span>
                            <span>
                                <i className="fas fa-chevron-right"></i>
                            </span>
                        </NavLink>
                        <NavLink
                            to={`/garage/appointments/${id}`}
                            className="garage-user-navigation-card"
                        >
                            <span
                                className="bg-secondary rounded"
                                style={{
                                    width: "50px",
                                    height: "85%",
                                }}
                            ></span>
                            <span className="mx-auto">{t('Complete Order')}</span>
                            <span>
                                <i className="fas fa-chevron-right"></i>
                            </span>
                        </NavLink>
                    </div>
                </div>
                <div className="garage-appointment-table">
                    <DataTable
                        value={this.state.appointments?.results}
                        scrollable
                        scrollHeight="100%"
                        emptyMessage={t('No Record Found')}
                    >
                        <Column field="store.name" header={t('Store Name')}></Column>
                        <Column
                            field="appointment_type"
                            header={t('Type of Booking')}
                        ></Column>
                        <Column field="date" header={t('Start Date')}></Column>
                        <Column field="date" header={t('End Date')}></Column>
                        <Column
                            field="appointment_status"
                            header={t('Status')}
                        ></Column>
                        <Column
                            field="invoice_status"
                            header={t('Invoice')}
                            body={this.invoiceTemplate}
                        ></Column>
                        <Column field="id" header={t('Action')} body={this.actionTemplate}></Column>
                    </DataTable>
                </div>
                {
                    this.state.editModal ? <EditGarage ref={this.createChild}
                        data={this.state.garageUser}
                        id={id}
                        refresh={this.getGarageUserData}
                        closeModal={this.closeModal} />
                        : null
                }
                <Errormodal ref={this.Errormodalref} message={this.state.errorMsg} />
            </div>
        );
    }
}
export default withTranslation()(withRouter(GarageView));
