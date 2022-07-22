import React, { Component } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { CarMakePostData } from "../api/POST";
import { Modal } from "bootstrap";
import Errormodal from "../../../../common_component/errormodal/Errormodal";
import { connect } from "react-redux";
import { Translation } from 'react-i18next';

const validationSchema = yup.object().shape({
    name: yup.string().required("Name field is required!").min(3, "Too Short!").max(25, "Too Long!"),
    description: yup.string().required("Description field is required!").min(3, "Too Short!").max(200, "Too Long!"),
    type: yup.string().required("Description field is required!"),
});

class CarAddMakes extends Component {
    constructor(props) {
        super(props);
        this.modalRef = React.createRef();
        this.Errormodalref = React.createRef();
        this.showLoading = this.showLoading.bind(this);
        this.state = {
            errorMsg: "",
        };
        // console.log("this change", this.props.id);
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
                    <div>
                        <div className="modal fade" ref={this.modalRef} tabindex="-1">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5
                                            class="modal-title"
                                            id="staticBackdropLabel"
                                        >
                                            {t('Add')}
                                        </h5>
                                        <button
                                            type="button"
                                            class="btn-close"
                                            onClick={() => this.hideModal()}
                                            aria-label="Close"
                                        ></button>
                                    </div>
                                    <div className="modal-body">
                                        <Formik
                                            initialValues={{
                                                name: "",
                                                description: "",
                                                type: this.props.id,
                                            }}
                                            // validationSchema={validationSchema}
                                            validationSchema={yup.object().shape({
                                                name: yup.string().required(t("Name field is required!")).min(3, t('Too Short!')).max(25, t("Too Long!")),
                                                description: yup.string().required(t('Description field is required!')).min(3, t('Too Short!')).max(200, t("Too Long!")),
                                            })}
                                            onSubmit={(values, onSubmitProps) => {
                                                console.log(values);
                                                this.showLoading()
                                                let fd = new FormData(
                                                    document.getElementById(
                                                        "carTypeForms"
                                                    )
                                                );
                                                CarMakePostData(fd).then(
                                                    (res) => {
                                                        if (res.data.Status) {
                                                            console.log(res);
                                                            this.updateStatus()
                                                            onSubmitProps.resetForm();
                                                            this.showLoading()
                                                            this.hideModal();
                                                            this.props.refresh()
                                                        } else {
                                                            this.setState({ errorMsg: res.data.Message })
                                                            this.Errormodalref.current.showModal()
                                                        }
                                                    },
                                                    (error) => {
                                                        console.log(error);
                                                        this.showLoading()
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
                                            <Form id="carTypeForms">
                                                <div className="mb-3">
                                                    <label
                                                        className="label"
                                                        htmlFor="name"
                                                    >
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
                                                        maxLength={200}
                                                    />
                                                    <div className="text-danger">
                                                        <ErrorMessage name="description" />
                                                    </div>
                                                </div>
                                                <div className="mb-3 d-none">
                                                    <label
                                                        className="label"
                                                        htmlFor="type"
                                                    >
                                                        {t('Type')}
                                                    </label>
                                                    <Field
                                                        id="type"
                                                        name="type"
                                                        className="form-control"
                                                    />
                                                    <div className="text-danger">
                                                        <ErrorMessage name="type" />
                                                    </div>
                                                </div>
                                                <button
                                                    className="btn-navy mx-auto mt-4 mb-5"
                                                    type="submit"
                                                    style={{ width: "60%" }}
                                                // type="submit"
                                                >
                                                    {t('Create')}
                                                </button>
                                            </Form>
                                        </Formik>
                                    </div>
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
)((CarAddMakes));
