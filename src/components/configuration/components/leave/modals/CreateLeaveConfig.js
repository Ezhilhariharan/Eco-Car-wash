import React, { Component } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { Modal } from "bootstrap";
import Errormodal from "../../../../common_component/errormodal/Errormodal";
import { connect } from "react-redux";
import { Translation } from 'react-i18next';
import { createLeaveConfig } from "../api/POST";

const validationSchema = yup.object().shape({
    name: yup.string().required("Name field is required!").min(3, "Too Short!").max(25, "Too Long!"),
    description: yup.string().required("Description field is required!").min(3, "Too Short!").max(201, "Too Long!"),
    date: yup.date().required("Date field is required!"),
});

class CreateLeaveConfig extends Component {
    constructor(props) {
        super(props);
        this.modalRef = React.createRef();
        this.state = {
            errorMsg: "",
        };
        this.Errormodalref = React.createRef();
        this.showLoading = this.showLoading.bind(this)
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
    }
    updateStatus = () => {
        this.props.showtoast({
            text: "Created Successfully ",
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
                    <div className="modal" ref={this.modalRef} tabIndex="-1">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">{t('Add')} </h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => this.hideModal()}
                                        aria-label="Close"
                                    ></button>
                                </div>
                                <div className="modal-body mx-5">
                                    <Formik
                                        initialValues={{
                                            name: "",
                                            description: "",
                                            date: "",
                                        }}
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
                                                    "createLeaveForm"
                                                )
                                            );
                                            createLeaveConfig(fd).then(
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
                                        <Form id="createLeaveForm">
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
                                                    {t('Date')}
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
                                                {t('Create')}
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
)((CreateLeaveConfig));
// export default CreateLeaveConfig;
