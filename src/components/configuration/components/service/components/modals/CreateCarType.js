import React, { Component } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { Modal } from "bootstrap";
import Errormodal from "../../../../../common_component/errormodal/Errormodal";
import { connect } from "react-redux";
import { Translation } from 'react-i18next';
import { postCarType } from "../../api/POST";

const validationSchema = yup.object().shape({
    name: yup.string().required("Name field is required!").min(3, "Too Short!").max(25, "Too Long!"),
    description: yup.string().required("Description field is required!").min(3, "Too Short!").max(200, "Too Long!"),
});

class CreateCarType extends Component {
    constructor(props) {
        super(props);
        this.modalRef = React.createRef();
        this.state = {
            profile: "https://avatars.dicebear.com/api/initials/random.svg",
            errorMsg: "",
        };
        this.modalRef = React.createRef();
        this.Errormodalref = React.createRef();
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
    render() {
        return (
            <Translation>{
                (t, { i18n }) =>
                    <div className="modal fade" ref={this.modalRef} tabIndex="-1">
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
                                        }}
                                        // validationSchema={validationSchema}
                                        validationSchema={yup.object().shape({
                                            name: yup.string().required(t("Name field is required!")).min(3, t('Too Short!')).max(25, t("Too Long!")),
                                            description: yup.string().required(t('Description field is required!')).min(3, t('Too Short!')).max(200, t("Too Long!")),
                                        })}
                                        onSubmit={(values, onSubmitProps) => {
                                            console.log(values);
                                            let fd = new FormData(
                                                document.getElementById("carTypeForm")
                                            );
                                            postCarType(fd).then(
                                                (res) => {
                                                    if (res.data.Status) {
                                                        onSubmitProps.resetForm();
                                                        this.hideModal();
                                                        this.props.updateCarTypeList()
                                                        this.updateStatus()
                                                    } else {
                                                        this.setState({ errorMsg: res.data.Message })
                                                        this.Errormodalref.current.showModal()
                                                    }
                                                },
                                                (error) => {
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
                                        <Form id="carTypeForm">
                                            <div className="mb-3">
                                                <label className="label" htmlFor="name">
                                                    {t('Name')}
                                                </label>
                                                <Field
                                                    id="name"
                                                    name="name"
                                                    type="text"
                                                    maxLength={25}
                                                    className="form-control"
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
    };
};
export default connect(
    null,
    mapDispatchToProps,
    null,
    { forwardRef: true }
)((CreateCarType));
// export default CreateCarType;
