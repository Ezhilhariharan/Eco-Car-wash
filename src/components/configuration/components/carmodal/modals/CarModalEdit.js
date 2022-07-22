import React, { Component } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { Modal } from "bootstrap";
import { CarMakeGetEdit, GetCarModalDataEditId } from "../api/GET";
import { PatchCarMakeData, PatchMethodCarModalData } from "../api/PATCH";
import Errormodal from "../../../../common_component/errormodal/Errormodal";
import { connect } from "react-redux";
import { Translation } from 'react-i18next';

// import { PatchCarMakeData } from "../api/PATCH";
// import { CarMakeGetEdit } from "../api/GET";

const validationSchema = yup.object().shape({
    name: yup.string().required("Name field is required!").min(3, "Too Short!").max(25, "Too Long!"),
    description: yup.string().required("Description field is required!").min(3, "Too Short!").max(200, "Too Long!"),
    make: yup.string().required("make field is required!"),
});

class CarModalEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            description: "",
            errorMsg: "",
        };
        this.modalRef = React.createRef();
        this.Errormodalref = React.createRef();
        this.showLoading = this.showLoading.bind(this)
        console.log("received id in reacts", this.props.id);
    }

    componentDidMount() {
        GetCarModalDataEditId(this.props.editLeave)
            .then((res) => {
                let value = res.data.Data;
                this.setState({
                    name: value.name,
                    description: value.description,
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
                                    <h5 className="modal-title">
                                        {t('Edit')}
                                    </h5>
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
                                            make: this.props.id,
                                        }}
                                        enableReinitialize={true}
                                        // validationSchema={validationSchema}
                                        validationSchema={yup.object().shape({
                                            name: yup.string().required(t("Name field is required!")).min(3, t('Too Short!')).max(25, t("Too Long!")),
                                            description: yup.string().required(t('Description field is required!')).min(3, t('Too Short!')).max(200, t("Too Long!")),
                                            make: yup.string().required(t("required!")),
                                        })}
                                        onSubmit={(values, onSubmitProps) => {
                                            // console.log("car model edit data", values);
                                            this.showLoading()
                                            let fd = new FormData(
                                                document.getElementById(
                                                    "updateLeaveFormsModel"
                                                )
                                            );
                                            PatchMethodCarModalData(
                                                this.props.editLeave,
                                                fd
                                            ).then(
                                                (res) => {
                                                    this.showLoading()
                                                    console.log("edit", res);
                                                    if (res.data.Status) {
                                                        onSubmitProps.resetForm();
                                                        this.hideModal();
                                                        this.updateStatus()
                                                        this.props.resetEditData();
                                                        this.props.updateCarTypeList()
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
                                        <Form id="updateLeaveFormsModel">
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
                                                    maxLength={200}
                                                />
                                                <div className="text-danger">
                                                    <ErrorMessage name="description" />
                                                </div>
                                            </div>
                                            <div className="d-none">
                                                <label
                                                    className="label"
                                                    htmlFor="message"
                                                >
                                                    {t('make')}
                                                </label>
                                                <Field
                                                    id="make"
                                                    name="make"
                                                    className="form-control"
                                                />
                                                <div className="text-danger">
                                                    <ErrorMessage name="message" />
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
)((CarModalEdit));
// export default CarModalEdit;
