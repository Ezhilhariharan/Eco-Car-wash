import React, { Component } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { Modal } from "bootstrap";
import Errormodal from "../../../../../common_component/errormodal/Errormodal";
import { connect } from "react-redux";
import { Translation } from 'react-i18next';
import { getService } from "../../api/GET";
import { updateService } from "../../api/PATCH";

const number = /^[0-9]{1,5}$/;
const validationSchema = yup.object().shape({
    title: yup.string().required("Title field is required!").min(3, "Too Short!").max(25, "Too Long!"),
    price: yup
        .string()
        .test(
            '',
            'This field must be a decimal',
            value => (value + "").match(/^\d+(\.\d{1,2})?$/)
        )
        .required("Price field is required!"),
    timetaken: yup.string().matches(number, "number is not valid").required("Time Taken field is required!"),
});

class EditService extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            price: "",
            timetaken: "",
            errorMsg: "",
        };
        this.updateServiceModalRef = React.createRef();
        this.Errormodalref = React.createRef();
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.showLoading = this.showLoading.bind(this)
    }

    componentDidMount() {
        getService(this.props.editServiceID)
            .then((res) => {
                console.log(res.data);
                this.setState({ title: res.data.Data?.title });
                this.setState({ price: res.data.Data?.price });
                this.setState({ timetaken: res.data.Data?.timetaken });
            })
            .catch((err) => console.log(err));
    }

    showModal() {
        const modalEle = this.updateServiceModalRef.current;
        const bsModal = new Modal(modalEle, {
            backdrop: "static",
            keyboard: false,
        });
        bsModal.show();
    }

    hideModal() {
        const modalEle = this.updateServiceModalRef.current;
        const bsModal = Modal.getInstance(modalEle);
        bsModal.hide();
        this.props.resetEditId();
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
                        ref={this.updateServiceModalRef}
                        tabIndex="-1"
                    >
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">{t('Edit Service')}</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => this.hideModal()}
                                    // aria-label="Close"
                                    ></button>
                                </div>
                                <div className="modal-body mx-5">
                                    <Formik
                                        initialValues={{
                                            title: this.state.title,
                                            price: this.state.price,
                                            timetaken: this.state.timetaken,
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
                                            let fd = new FormData(
                                                document.getElementById(
                                                    `editServiceForm`
                                                )
                                            );
                                            updateService(
                                                this.props.editServiceID,
                                                fd
                                            ).then(
                                                (res) => {
                                                    // console.log(res);
                                                    this.showLoading()
                                                    if (res.data.Status) {
                                                        onSubmitProps.resetForm();
                                                        this.hideModal()
                                                        this.updateStatus()
                                                        this.props.getServiceData();

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
                                        <Form id={`editServiceForm`}>
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
                                                    className="form-control"
                                                    maxLength={25}
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
)((EditService));
// export default EditService;
