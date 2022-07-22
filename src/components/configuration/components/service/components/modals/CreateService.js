import React, { Component } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { Modal } from "bootstrap";
import Errormodal from "../../../../../common_component/errormodal/Errormodal";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Translation } from 'react-i18next';
import { postService } from "../../api/POST";

const number = /^[0-9]{1,5}$/;
// const validationSchema = yup.object().shape({
//     title: yup.string().required(t("Title field is required!")).min(3, t('Too Short!')).max(25, t("Too Long!")),
//     price: yup.string().test(
//         '',
//         t("This field must be a decimal"),
//         value => (value + "").match(/^\d+(\.\d{1,2})?$/)
//     ).required(t("Price field is required!")),
//     timetaken: yup.string().matches(number, t("number is not valid")).required(t("Time Taken field is required!")),
// });

class CreateService extends Component {
    constructor(props) {
        super(props);
        this.modalRef = React.createRef();
        this.Errormodalref = React.createRef();
        this.state = {
            errorMsg: "",
            serviceType: this.props.serviceType,
            serviceNature: this.props.serviceNature,
            carType: this.props.carType,
        };
        this.showModal = this.showModal.bind(this);
        this.showLoading = this.showLoading.bind(this)
        this.hideModal = this.hideModal.bind(this);
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
        console.log("this.Errormodalref", this.Errormodalref);
        return (
            <Translation>{
                (t, { i18n }) =>
                    <div className="modal fade" ref={this.modalRef} tabIndex="-1">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">{t('Add Service')}</h5>
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
                                            title: "",
                                            price: "",
                                            timetaken: "",
                                            service_type: this.state.serviceType,
                                            service_nature: this.state.serviceNature,
                                            car_type: this.state.carType.toString(),
                                        }}
                                        // validationSchema={validationSchema}
                                        validationSchema={yup.object().shape({
                                            title: yup.string().required(t("Title field is required!")).min(3, t('Too Short!')).max(25, t("Too Long!")),
                                            price: yup.string().test(
                                                '',
                                                t("This field must be a decimal"),
                                                value => (value + "").match(/^\d+(\.\d{1,2})?$/)
                                            ).required(t("Price field is required!")),
                                            timetaken: yup.string().matches(number, t("number is not valid")).required(t("Time Taken field is required!")),
                                        })}
                                        enableReinitialize={true}
                                        onSubmit={(values, onSubmitProps) => {
                                            console.log(values);

                                            this.showLoading()
                                            // let fd = new FormData(
                                            //     document.getElementById(
                                            //         `service${this.state.serviceNature}Form`
                                            //     )
                                            // );
                                            let formData = new FormData();
                                            formData.append("title", values.title);
                                            formData.append("price", values.price);
                                            formData.append("timetaken", values.timetaken);
                                            formData.append("service_type", values.service_type);
                                            formData.append("service_nature", values.service_nature);
                                            formData.append("car_type", values.car_type);
                                            postService(formData).then(
                                                (res) => {
                                                    this.showLoading()
                                                    // console.log(res);
                                                    if (res.data.Status) {
                                                        this.updateStatus()
                                                        this.hideModal();
                                                        this.props.getServiceData(
                                                            this.props.serviceNature
                                                        );
                                                        onSubmitProps.resetForm();
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
                                        <Form
                                            id={`service${this.state.serviceNature}Form`}
                                        >
                                            <div className="mb-3">
                                                {/* {this.props.serviceType}
										{this.props.serviceNature}
										{this.props.carType} */}
                                                <label
                                                    className="label"
                                                    htmlFor="title"
                                                >
                                                    {t('Title')}
                                                </label>
                                                <Field
                                                    id="title"
                                                    name="title"
                                                    type="text"
                                                    maxLength={25}
                                                    className="form-control"
                                                />
                                                <div className="text-danger">
                                                    <ErrorMessage name="title" />
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <label
                                                    className="label"
                                                    htmlFor="price"
                                                >
                                                    {t('Price')}
                                                </label>
                                                <Field
                                                    id="price"
                                                    name="price"
                                                    type="text"
                                                    maxLength={11}
                                                    className="form-control"
                                                />
                                                <div className="text-danger">
                                                    <ErrorMessage name="price" />
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <label
                                                    className="label"
                                                    htmlFor="timetaken"
                                                >
                                                    {t('Time Taken')}
                                                </label>
                                                <Field
                                                    id="timetaken"
                                                    name="timetaken"
                                                    type="text"
                                                    className="form-control"
                                                />
                                                <div className="text-danger">
                                                    <ErrorMessage name="timetaken" />
                                                </div>
                                            </div>
                                            <div className="d-none">
                                                <Field
                                                    id="service_type"
                                                    name="service_type"
                                                    type="text"
                                                    className="form-control"
                                                />
                                                <Field
                                                    id="service_nature"
                                                    name="service_nature"
                                                    type="text"
                                                    className="form-control"
                                                />
                                                <Field
                                                    id="car_type"
                                                    name="car_type"
                                                    type="text"
                                                    className="form-control"
                                                />
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
)(CreateService);
// export default CreateService;
