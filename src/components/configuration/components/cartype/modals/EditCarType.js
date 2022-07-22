import React, { Component } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { Modal } from "bootstrap";
import { connect } from "react-redux";
import Errormodal from "../../../../common_component/errormodal/Errormodal";
import { Translation } from 'react-i18next';
import { UpdateCarTypes } from "../api/PATCH";
import { GetCarTypeValues } from "../api/GET";

const validationSchema = yup.object().shape({
    name: yup.string().required("Name field is required!").min(3, "Too Short!").max(25, "Too Long!"),
    description: yup.string().required("Description field is required!").min(3, "Too Short!").max(200, "Too Long!"),
});

class EditCarType extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            description: "",
        };
        this.modalRef = React.createRef();
        this.Errormodalref = React.createRef();
        this.showLoading = this.showLoading.bind(this);
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
    }

    componentDidMount() {
        GetCarTypeValues(this.props.editLeave)
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
                        // id="updateLeaveConfigModal"
                        ref={this.modalRef}
                        tabIndex="-1"
                    >
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">{t('Edit')} </h5>
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
                                        }}
                                        enableReinitialize={true}
                                        // validationSchema={validationSchema}
                                        validationSchema={yup.object().shape({
                                            name: yup.string().required(t("Name field is required!")).min(3, t('Too Short!')).max(25, t("Too Long!")),
                                            description: yup.string().required(t('Description field is required!')).min(3, t('Too Short!')).max(200, t("Too Long!")),
                                        })}
                                        onSubmit={(values, onSubmitProps) => {
                                            // console.log(values);
                                            this.showLoading()
                                            let fd = new FormData(
                                                document.getElementById(
                                                    "updateLeaveForm"
                                                )
                                            );
                                            UpdateCarTypes(
                                                this.props.editLeave,
                                                fd
                                            ).then(
                                                (res) => {
                                                    console.log(" this.showLoading()", res);
                                                    this.showLoading()
                                                    if (res.data.Status) {
                                                        onSubmitProps.resetForm();
                                                        this.hideModal()
                                                        this.updateStatus()
                                                        this.props.updateCarTypeList()
                                                        this.props.resetEditData();

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
)((EditCarType));
// export default EditCarType;
