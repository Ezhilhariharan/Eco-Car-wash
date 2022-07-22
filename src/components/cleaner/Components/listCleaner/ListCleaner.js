import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Staff } from "../../../../utils/Staff";
import axios from "axios";
import { Toast } from "primereact/toast";
import * as yup from "yup";
import { connect } from "react-redux";
import { withTranslation } from 'react-i18next';

import CreateCleaner from "./modals/CreateCleaner";
import EditCleaner from "./modals/EditCleaner";

import "./styles/CleanerLayout.scss";

const validationSchema = yup.object().shape({
    name: yup.string().required("Name field is required!"),
    email: yup
        .string()
        .email("Invalid email id")
        .required("Email field is required!"),
    mobile_no: yup.string().required("Required!"),
});

let url;
class ListCleaner extends Component {
    constructor(props) {
        super(props);
        url = this.props.match.url;
        this.state = {
            page: 1,
            lock: true,
            list: {},
            editedID: "",
            openCleanerModal: false,
            inputFeild: "",
        };
        this.Staff = new Staff();
        this.resetEdit = this.resetEdit.bind(this);
        this.nextTemplate = this.nextTemplate.bind(this);
        this.scrollLoader = this.scrollLoader.bind(this);
        this.getCleanerList = this.getCleanerList.bind(this);
        this.editTemplate = this.editTemplate.bind(this);
        this.resetCleanerList = this.resetCleanerList.bind(this);
        this.creationChild = React.createRef();
        this.updationChild = React.createRef();
    }

    componentDidMount() {
        this.getCleanerList();
        this.scrollLoader();
        this.props.toggleMenu();
    }
    componentWillUnmount() {
        this.props.toggleMenu();
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevState.inputFeild !== this.props.menu.searchFeild) {
            this.setState({ inputFeild: this.props.menu.searchFeild, list: {}, page: 1 }, () => {
                this.getCleanerList(true);
            });
        }
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
                if (!this.state.lock && this.state.list.next) {
                    this.setState({ lock: true }, () => {
                        this.setState({ page: this.state.page + 1 }, () => {
                            this.getCleanerList();
                        });
                    });
                }
            }
        });
    }

    resetCleanerList() {
        this.setState({ page: 1 }, () => {
            this.getCleanerList(true);
        });
    }

    getCleanerList(reset = false) {
        this.Staff.getStaff(3, this.state.page, this.state.inputFeild)
            .then((res) => {
                console.log('Cleaner List', res.data.Data, reset);
                if (Object.keys(this.state.list).length != 0 && !reset) {
                    let list = this.state.list.results;
                    list.push(...res.data.Data.results);
                    res.data.Data.results = list;
                    // console.log(res.data.Data);
                    this.setState({ list: res.data.Data });
                } else {
                    this.setState({ list: res.data.Data });
                }
                this.setState({ lock: false });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    showError(errTitle, errMsg) {
        this.toast.show({
            severity: "error",
            summary: errTitle,
            detail: errMsg,
            life: 3000,
        });
    }

    resetEdit() {
        this.setState({ editedID: "" });
    }

    nextTemplate(rowData) {
        return (
            <React.Fragment>
                <i
                    style={{ fontSize: "20px" }}
                    className="fas fa-pen mx-auto"
                    onClick={() =>
                        this.setState({ editedID: rowData.username }, () => this.updationChild.current.showModal())
                    }
                />
                <button
                    className="btn-navy-circle ms-5"
                    onClick={() => {
                        this.props.history.push(`/cleaner/${rowData.username}`);
                    }}
                    style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        fontSize: "1.5em",
                    }}
                >
                    <i className="fas fa-chevron-right"></i>
                </button>

            </React.Fragment>
        );
    }

    editTemplate(rowData) {
        return (
            <React.Fragment>
                <i
                    style={{ fontSize: "20px" }}
                    className="fas fa-pen mx-auto"
                    onClick={() =>
                        this.setState({ editedID: rowData.username }, () => this.updationChild.current.showModal())
                    }
                />
            </React.Fragment>
        );
    }
    changeStatus = (i) => {
        // console.log(i);
        let collegeList = this.state.list;
        if (collegeList.results[i].user_status == "active") {
            collegeList.results[i].user_status = "inactive";
        } else if (collegeList.results[i].user_status == "inactive") {
            collegeList.results[i].user_status = "active";
        }
        let formData = new FormData();
        formData.append("user_status", collegeList.results[i].user_status);
        axios
            .patch(`admin/manage_staff/${collegeList.results[i].username}/`, formData)
            .then((res) => {
                console.log(res.data);
                if (res.data.Status) {
                    this.setState({ list: collegeList });
                }
            })
            .catch((err) => console.log(err));
    }
    Toggle = (rowData) => {
        let i = this.state.list.results.indexOf(rowData);
        return (<div className="d-flex flex-row justify-content-center">
            <label className="customised-switch">
                <input
                    type="checkbox"
                    checked={rowData.user_status === "active" ? true : false}
                    onChange={() => this.changeStatus(i)}
                />
                <span className="customised-slider customised-round"></span>
            </label>
        </div>
        )
    }
    closeModal = () => {
        this.setState({ openCleanerModal: false })
    }
    addCleaner = () => {
        // if (this.creationChild.current != null) {
        this.setState({ openCleanerModal: true }, () => {
            this.creationChild.current.showModal()
        })
        // }
    }
    render() {
        // console.log("this.creationChild", this.state.list.results);
        const { t } = this.props
        return (
            <div className="cleaner-layout">
                <Toast ref={(el) => (this.toast = el)} />
                <div className="d-flex flex-row align-items-center">
                    <h2 className="me-5">{t('Cleaner List')}</h2>
                    <button
                        className="btn-white me-3"
                        style={{ width: "6rem", height: "2.5rem" }}
                        onClick={this.addCleaner}
                    >
                        {t('Add')} +
                    </button>
                </div>

                <div className="cleaner-body">
                    <DataTable
                        value={this.state.list.results}
                        scrollable
                        scrollHeight="100%"
                        emptyMessage={t('No Record Found')}
                    >
                        <Column
                            field="name"
                            header={t('Name')}
                            body={this.Staff.nameTemplate}
                        ></Column>
                        <Column
                            field="store_name"
                            header={t('Store Name')}
                            body={this.Staff.store_nameTemplate}
                        ></Column>
                        <Column
                            field="mobile_no"
                            header={t('mobile no')}
                            body={this.Staff.phoneTemplate}
                        ></Column>
                        <Column
                            field="orders"
                            header={t('Order Undertaken')}
                            body={this.Staff.orderTemplate}
                        ></Column>
                        <Column
                            field="id"
                            header={t('Status')}
                            body={this.Toggle}
                        ></Column>
                        <Column
                            field="id"
                            header={t('Action')}
                            body={this.nextTemplate}
                        ></Column>
                    </DataTable>
                </div>
                {this.state.openCleanerModal ?
                    <CreateCleaner
                        ref={this.creationChild}
                        getCleanerList={this.getCleanerList}
                        closeModal={this.closeModal}
                        resetCleanerList={this.resetCleanerList}
                    />
                    : null
                }
                {this.state.editedID != "" ? (
                    <EditCleaner
                        ref={this.updationChild}
                        resetCleanerList={this.resetCleanerList}
                        editedID={this.state.editedID}
                        resetEdit={this.resetEdit}
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
            dispatch({ type: "SEARCH_BAR" });
        },
    };
};

export default withTranslation()(connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(ListCleaner)));

// export default withRouter(ListCleaner);
