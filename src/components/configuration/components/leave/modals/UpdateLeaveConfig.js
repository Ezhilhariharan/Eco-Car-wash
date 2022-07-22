import React, { Component } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { Modal } from "bootstrap";
import Errormodal from "../../../../common_component/errormodal/Errormodal";
import { connect } from "react-redux";
import { Translation } from 'react-i18next';
import { updateLeaveConfig } from "../api/PATCH";
import { getSingleLeaveConfig } from "../api/GET";

const validationSchema = yup.object().shape({
    name: yup.string().required("Name field is required!").min(3, "Too Short!").max(25, "Too Long!"),
    description: yup.string().required("Description field is required!").min(3, "Too Short!").max(201, "Too Long!"),
    date: yup.string().required("Date field is required!"),
});

class UpdateLeaveConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            description: "",
            date: "",
            errorMsg: ""
        };
        this.modalRef = React.createRef();
        this.Errormodalref = React.createRef();
        this.showLoading = this.showLoading.bind(this)
    }

    componentDidMount() {
        getSingleLeaveConfig(this.props.editLeave)
            .then((res) => {
                let value = res.data.Data;
                console.log("getSingleLeaveConfig", value, this.props.editLeave);
                this.setState({
                    name: value.name,
                    description: value.description,
                    date: value.date,
                });
            })
            .catch((err) => {
                console.log(err);
            });
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
        this.props.closeModal()
        // this.props.editLeaveData("");
    }
    updateStatus = () => {
        this.props.showtoast({
            text: "Updated Successfully ",
            time: new Date().getTime(),
        });
    };
    showLoading() {
        this.props.loading({ loadingState: new Date().getTime() });
    }
    render() {
        return (
            <Translation>{
                (t, { i18n }) =>
                    <div
                        className="modal fade"
                        id="updateLeaveConfigModal"
                        ref={this.modalRef}
                        tabIndex="-1"
                    >
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title"> {t('Edit')}</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => this.hideModal()}
                                    ></button>
                                </div>
                                <div className="modal-body mx-5">
                                    <Formik
                                        initialValues={{
                                            name: this.state.name,
                                            description: this.state.description,
                                            date: this.state.date,
                                        }}
                                        enableReinitialize={true}
                                        // validationSchema={validationSchema}
                                        validationSchema={yup.object().shape({
                                            name: yup.string().required(t("Name field is required!")).min(3, t('Too Short!')).max(25, t("Too Long!")),
                                            description: yup.string().required(t('Description field is required!')).min(3, t('Too Short!')).max(200, t("Too Long!")),
                                            date: yup.date().required(t("required!")),
                                        })}
                                        onSubmit={(values, onSubmitProps) => {
                                            console.log(values);
                                            this.showLoading()
                                            let fd = new FormData(
                                                document.getElementById(
                                                    "updateLeaveForm"
                                                )
                                            );
                                            updateLeaveConfig(
                                                this.props.editLeave,
                                                fd
                                            ).then(
                                                (res) => {
                                                    // console.log(res);
                                                    this.showLoading()
                                                    if (res.data.Status) {
                                                        this.props.getLeaveConfig();
                                                        onSubmitProps.resetForm();
                                                        this.updateStatus()
                                                        this.hideModal();
                                                    } else {
                                                        this.setState({ errorMsg: res.data.Message })
                                                        this.Errormodalref.current.showModal()
                                                    }
                                                },
                                                (error) => {
                                                    this.showLoading()
                                                    console.log(error);
                                                    if (!error.response.data.Status) {
                                                        if (error.response.data.hasOwnProperty('Message')) {
                                                            this.setState({ errorMsg: error.response.data.Message })
                                                            this.Errormodalref.current.showModal()
                                                        }
                                                    }
                                                }
                                            );
                                        }}
                                    >
                                        <Form id="updateLeaveForm">
                                            <div className="mb-3">
                                                <label className="label" htmlFor="name">
                                                    {t('Name')}
                                                </label>
                                                <Field
                                                    id="name"
                                                    name="name"
                                                    type="text"
                                                    className="form-control"
                                                    maxLength={25}
                                                />
                                                <div className="text-danger">
                                                    <ErrorMessage name="name" />
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <label
                                                    className="label"
                                                    htmlFor="description"
                                                >
                                                    {t('Description')}
                                                </label>
                                                <Field
                                                    id="description"
                                                    name="description"
                                                    as="textarea"
                                                    className="form-control"
                                                    maxLength={199}
                                                />
                                                <div className="text-danger">
                                                    <ErrorMessage name="description" />
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <label className="label" htmlFor="date">
                                                    Date{t('Name')}
                                                </label>
                                                <Field
                                                    id="date"
                                                    name="date"
                                                    type="date"
                                                    min={new Date().toISOString().split("T")[0]}
                                                    className="form-control"
                                                />
                                                <div className="text-danger">
                                                    <ErrorMessage name="date" />
                                                </div>
                                            </div>
                                            <button
                                                className="btn-navy mx-auto m-5"
                                                type="submit"
                                            >
                                                {t('Update')}
                                            </button>
                                        </Form>
                                    </Formik>
                                </div>
                            </div>
                        </div>
                        <Errormodal ref={this.Errormodalref} message={this.state.errorMsg} />
                    </div>
            }
            </Translation>
        );
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        showtoast: (data) => {
            dispatch({ type: "ShowToast", text: data.text, time: data.time });

        },
        loading: (data) => {
            dispatch({ type: "Loading", loadingState: data.loadingState });
        },
    };
};
export default connect(
    null,
    mapDispatchToProps,
    null,
    { forwardRef: true }
)((UpdateLeaveConfig));
// export default UpdateLeaveConfig;
