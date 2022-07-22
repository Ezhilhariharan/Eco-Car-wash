import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "./styles/StoreLeaves.scss"
import { getStoreLeaves } from "./api/GET";
import { updateUserLeave } from "./api/PATCH";
import { Modal } from "bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import DatePicker from "react-datepicker";
import { withTranslation } from 'react-i18next';
import "react-datepicker/dist/react-datepicker.css";

let url, param;
let data;
const styles = { width: 260, display: 'block', marginBottom: 10 };
class LeaveDetails extends Component {
    constructor(props) {
        super(props);
        url = this.props.match.path;
        param = this.props.match.params.id
        this.state = {
            storeLeavesList: [],
            active: 1,
            date: "",
            todayDate: new Date,
            startDate: "",
            endDate: "",
        };
        this.loadStoreList = this.loadStoreList.bind(this);
        this.approvetemplate = this.approvetemplate.bind(this);
        this.modalRef = React.createRef();
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
    }

    componentDidMount() {
        this.loadStoreList();
    }

    loadStoreList() {
        console.log("cool", typeof param,);
        try {
            // if (Number.isInteger(param)) {
            //     data = `?${param}`;
            // } else {
            data = `?${param}`;
            console.log("cool", param,);
            // }

        } catch (e) {
            data = "";
        }

        this.getStoreData(data, this.state.date)
    }
    getStoreData(data, date) {
        getStoreLeaves(data, "single", date).then((res) => {
            console.log("list", res);
            this.setState({ storeLeavesList: res.data.Data });
        });
    }

    approvetemplate(rowData) {
        let i = this.state.storeLeavesList.indexOf(rowData);
        const { t } = this.props
        return (
            <React.Fragment>
                {/* <div className="d-flex flex-row"> this.state.storeLeavesList[i].approved_by */}
                {this.state.storeLeavesList[i].status === "inactive" ?
                    <>
                        {t('Rejected by')} {rowData.approved_by.name}
                    </>
                    :
                    <>
                        {this.state.storeLeavesList[i].is_approved ?
                            <>
                                {t('Approved by')} {rowData.approved_by.name}
                            </> :
                            <div className=" split-btn ">
                                {/* <div className=" "> */}
                                <button
                                    className="btn-navy"
                                    onClick={() => {
                                        updateUserLeave(rowData.id, {
                                            is_approved: true,
                                        }).then(
                                            (res) => {
                                                console.log("list", res);
                                                let list = this.state.storeLeavesList;
                                                list[i] = res.Data;
                                                this.setState({ storeLeavesList: list });
                                            },
                                            (err) => console.log(err)
                                        );
                                    }}
                                >
                                    {t('Approve')}
                                </button>
                                <button
                                    className="btn-navy "
                                    onClick={() => {
                                        updateUserLeave(rowData.id, {
                                            status: "inactive",
                                        }).then(
                                            (res) => {
                                                console.log("list", res);
                                                let list = this.state.storeLeavesList;
                                                list[i] = res.Data;
                                                this.setState({ storeLeavesList: list });
                                            },
                                            (err) => console.log(err)
                                        );
                                    }}
                                >
                                    {t('Reject')}
                                </button>
                                {/* </div> */}
                            </div>

                        }
                    </>

                    //     <>
                    //        
                    //     </>
                    // ) : (
                    //     <button
                    //         className="btn-navy"
                    //         onClick={() => {
                    //             updateUserLeave(rowData.id, {
                    //                 is_approved: true,
                    //             }).then(
                    //                 (res) => {
                    //                     console.log("list", res);
                    //                     let list = this.state.storeLeavesList;
                    //                     list[i] = res.Data;
                    //                     this.setState({ storeLeavesList: list });
                    //                 },
                    //                 (err) => console.log(err)
                    //             );
                    //         }}
                    //     >
                    //         {t('Approve')}
                    //     </button>
                }
                {/* </div> */}

            </React.Fragment>
        );
    }
    showModal() {
        const modalEle = this.modalRef.current;
        const bsModal = new Modal(modalEle, {
            backdrop: "static",
            keyboard: false,
        });
        bsModal.show();
    }
    hideModal() {
        const modalEle = this.modalRef.current;
        const bsModal = Modal.getInstance(modalEle);
        bsModal.hide();
    }
    handleSelect = (dates) => {
        const [start, end] = dates;
        let startFormat = start.toISOString().split("T")[0];
        // console.log(start, end, startFormat);
        this.setState({ startDate: start })
        if (end) {
            let toFormat = end.toISOString().split("T")[0];
            this.setState({ endDate: end }, () => {
                getStoreLeaves(data, "range", startFormat, toFormat).then((res) => {
                    this.setState({ storeLeavesList: res.data.Data });
                });
                // this.getStoreData(data, range ,start,end)
                this.hideModal()
            })
        }
    }
    render() {
        const { t } = this.props
        return (
            <div className="store-staff-leaves h-100 w-100">
                <div className="d-flex flex-row store-staff-leaves-head w-100">
                    <div
                        className="lay_stores"
                        style={{ display: "flex", gap: "20px", width: "100%" }}
                    >
                        <div className="left_store" style={{ width: "90px" }}>
                            <button
                                className="btn-navy-circle"
                                onClick={() => this.props.history.goBack()}
                                style={{
                                    width: "50px",
                                    height: "50px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <i className="fas fa-chevron-left"></i>
                            </button>
                        </div>
                        <div
                            className="right_store d-flex flex-row"
                        >
                            <p className="my-auto">{t('Number of Leaves')}</p>
                            <button className="btn-navy ms-5 my-auto" onClick={this.showModal}>{t('Date Filter')}</button>

                        </div>
                    </div>
                </div>
                <div className="d-flex flex-column store-staff-leaves-body w-100">
                    {
                        this.state.storeLeavesList.length > 0 ?
                            <DataTable
                                value={this.state.storeLeavesList}
                                scrollable
                                scrollHeight="100%"
                            >
                                <Column field="title" header="Title"></Column>
                                <Column
                                    field="description"
                                    header={t('Description')}
                                ></Column>
                                <Column field="from_date" header={t('From')}></Column>
                                <Column field="to_date" header={t('TO')}></Column>
                                <Column field="days" header={t('No.of Days')}></Column>
                                <Column
                                    field="user.name"
                                    header={t('Requested By')}
                                ></Column>
                                <Column
                                    field="approved_by.name"
                                    header={t('Action By')}
                                    body={this.approvetemplate}
                                ></Column>
                            </DataTable>
                            :
                            <center className="mt-3">{t('No Record Found')}</center>
                    }

                </div>
                <div className="modal" ref={this.modalRef} tabIndex="-1">
                    <div className="modal-dialog modal-md">
                        <div className="modal-content pb-5">
                            <div className="modal-header">
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => this.hideModal()}
                                    aria-label="Close"
                                ></button>
                            </div>
                            <div className="heading-row d-flex flex-row mx-auto ">
                                <h4 className={this.state.active === 1 ? "active" : null}
                                    onClick={() => this.setState({ active: 1 })}>{t('Date')}</h4>
                                <h4 className={this.state.active === 2 ? "active" : null}
                                    onClick={() => this.setState({ active: 2 })}>{t('Custom')}</h4>
                            </div>
                            <div className="mx-auto model-Width mt-5 mb-4">
                                {
                                    this.state.active === 1 ?
                                        <div className="mx-auto w-75">
                                            <Formik
                                                initialValues={{
                                                    date_joined: "",
                                                }}
                                                onSubmit={(values, onSubmitProps) => {
                                                    this.getStoreData(data, values.date_joined)
                                                    this.hideModal()
                                                }}
                                            >
                                                <Form id="managerForm">
                                                    <div className="row">
                                                        <div className=" mb-3">
                                                            <Field
                                                                id="date_joined"
                                                                name="date_joined"
                                                                type="date"
                                                                // min={new Date().toISOString().split("T")[0]}
                                                                className="form-control"
                                                            />
                                                            <div className="text-danger">
                                                                <ErrorMessage
                                                                    name="date_joined"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button
                                                        className="btn-navy mt-4  w-50 mx-auto"
                                                        type="submit"
                                                    >{t('Filter')}</button>
                                                </Form>
                                            </Formik>
                                        </div> :
                                        <div>

                                            <DatePicker
                                                selected={this.state.todayDate}
                                                onChange={this.handleSelect}
                                                startDate={this.state.startDate}
                                                endDate={this.state.endDate}
                                                selectsRange
                                                inline
                                            />

                                        </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default withTranslation()(withRouter(LeaveDetails));
