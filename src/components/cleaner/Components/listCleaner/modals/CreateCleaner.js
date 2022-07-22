import React, { Component } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { Modal } from "bootstrap";
import { Toast } from "primereact/toast";
import axios from "axios";
import Errormodal from "../../../../common_component/errormodal/Errormodal";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Translation } from 'react-i18next';

const validationSchema = yup.object().shape({
    name: yup.string().required("Name field is required!").min(3, "Too Short!"),
    email: yup.string().email("Enter Valid email").required("Email field is required!"),
    mobile_no: yup.string().test("", "Enter Valid Mobile no", (value) =>
        (value + "").match(/^[\d\-\s]{6,18}$/)
    ).required("Mobile number field is required!"),
    date_joined: yup.date().required("Date Joined field is required!"),
    password: yup.string().required("required!"),
});

let doc, profileImage;
class CreateCleaner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profile: "https://avatars.dicebear.com/api/initials/random.svg",
            errorMsg: "",
            showHidecurrentPassword: false,
            imageName: "",
            documentName: ""
        };
        this.modalRef = React.createRef();
        this.Errormodalref = React.createRef();
        this.showError = this.showError.bind(this);
        this.changeImage = this.changeImage.bind(this);
        this.changeDocument = this.changeDocument.bind(this);
        // this.changeDocument = this.changeDocument.bind(this);
        this.showLoading = this.showLoading.bind(this);
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
        this.setState({ imageName: "" });
    }

    showError(errTitle, errMsg) {
        this.toast.show({
            severity: "error",
            summary: errTitle,
            detail: errMsg,
            life: 3000,
        });
    }

    changeImage() {
        let file = document.getElementById("profile_image").files[0];
        profileImage = document.getElementById("profile_image").files[0];
        if (file) {
            if (file.size < 20971520) {
                this.setState({ imageName: file.name });
                var reader = new FileReader();
                reader.onload = () => {
                    this.setState({ profile: reader.result });
                };
                reader.readAsDataURL(file);
            } else {
                console.log("Too Big"); this.setState({ errorMsg: "Size Limit Exceeds" })
                this.Errormodalref.current.showModal()
            }
        }
    }

    changeDocument() {
        let file = document.getElementById("document").files[0];
        doc = document.getElementById("document").files[0];

        if (file) {
            if (file.size < 2097152) {
                this.setState({ documentName: file.name });
                var reader = new FileReader();
                reader.onload = () => {
                };
                reader.readAsDataURL(file);
            } else {
                // console.log("Too Big");
                this.setState({ errorMsg: "Size Limit Exceeds" })
                this.Errormodalref.current.showModal()
            }
        }
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
                        <Toast ref={(el) => (this.toast = el)} />
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" onClick={this.updateToast} >{t('Add Cleaners')}</h5>
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
                                            email: "",
                                            mobile_no: "",
                                            date_joined: "",
                                            password: "",
                                        }}
                                        // validationSchema={validationSchema}
                                        validationSchema={yup.object().shape({
                                            name: yup.string().required(t("Name field is required!")).min(3, t('Too Short!')),
                                            email: yup.string().email(t('Enter Valid email address!')).required(t('Email field is required!')),
                                            mobile_no: yup.string().test("", t('Enter Valid Mobile no'), (value) =>
                                                (value + "").match(/^[\d\-\s]{6,18}$/)
                                            ).required(t('Mobile number field is required!')),
                                            date_joined: yup.date().required(t('Date Joined field is required!')),
                                            password: yup.string().required(t("required!")),
                                        })}
                                        onSubmit={(values, onSubmitProps) => {
                                            // console.log(values);
                                            this.showLoading("submit")
                                            let fd = new FormData(
                                                document.getElementById("cleaner_form")
                                            );

                                            // if (doc) {
                                            //     fd.set("document", doc)
                                            // } else {
                                            //     fd.delete("document")
                                            // }
                                            // if (values.password) {
                                            //     fd.set("password", values.password)
                                            // } else {
                                            //     fd.delete("password")
                                            // }

                                            axios
                                                .post("admin/manage_staff/", fd)
                                                .then((res) => {
                                                    console.log(res.data);
                                                    if (res.data.Status) {
                                                        this.updateStatus()
                                                        this.showLoading()
                                                        this.props.resetCleanerList();
                                                        onSubmitProps.resetForm();
                                                        this.setState({
                                                            profile:
                                                                "https://avatars.dicebear.com/api/initials/random.svg",
                                                        });
                                                        this.hideModal();
                                                    } else {
                                                        this.setState({ errorMsg: res.data.Message })
                                                        this.Errormodalref.current.showModal()
                                                    }
                                                })
                                                .catch((error) => {
                                                    this.showLoading()
                                                    console.log("error", error.response)
                                                    if (!error.response.data.Status) {
                                                        if (error.response.data.hasOwnProperty('Message')) {
                                                            this.setState({ errorMsg: error.response.data.Message })
                                                            this.Errormodalref.current.showModal()
                                                        }
                                                    }

                                                });
                                        }}
                                    >
                                        {({ values }) => (
                                            <Form id="cleaner_form">
                                                <div className="row">
                                                    <div className="col-6 mb-3">
                                                        <label
                                                            className="label"
                                                            htmlFor="name"
                                                        // onClick={() => this.showLoading()}
                                                        >
                                                            {t('Name')}
                                                        </label>
                                                        <Field
                                                            id="name"
                                                            name="name"
                                                            type="text"
                                                            className="form-control"
                                                            maxLength={25}

                                                        // onBlur={(e) =>
                                                        //     e.target.value != ""
                                                        //         ? this.setState({
                                                        //             profile: `https://avatars.dicebear.com/api/initials/${e.target.value}.svg`,
                                                        //         })
                                                        //         : false
                                                        // }
                                                        />
                                                        <div className="text-danger">
                                                            <ErrorMessage name="name" />
                                                        </div>
                                                    </div>

                                                    <div className="col-6 mb-3">
                                                        <label
                                                            className="label"
                                                            htmlFor="email"
                                                        >
                                                            {t('Email')}
                                                        </label>
                                                        <Field
                                                            id="email"
                                                            name="email"
                                                            type="email"
                                                            className="form-control"
                                                        />
                                                        <div className="text-danger">
                                                            <ErrorMessage name="email" />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="row">
                                                    <div className="col-6 mb-3">
                                                        <label
                                                            className="label"
                                                            htmlFor="mobile_no"
                                                        >
                                                            {t('Phone Number')}
                                                        </label>
                                                        <Field
                                                            id="mobile_no"
                                                            name="mobile_no"
                                                            type="text"
                                                            className="form-control"
                                                        />
                                                        <div className="text-danger">
                                                            <ErrorMessage name="mobile_no" />
                                                        </div>
                                                    </div>

                                                    <div className="col-6 mb-3">
                                                        <label
                                                            className="label"
                                                            htmlFor="date_joined"
                                                        >
                                                            {t('Date Joined')}
                                                        </label>
                                                        <Field
                                                            id="date_joined"
                                                            name="date_joined"
                                                            type="date"
                                                            // min={new Date().toISOString().split("T")[0]}
                                                            className="form-control"
                                                        />
                                                        <div className="text-danger">
                                                            <ErrorMessage name="date_joined" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-6 mb-3">
                                                    <label
                                                        className="label"
                                                        htmlFor="date_joined"
                                                    >
                                                        {t('Password')}
                                                    </label>
                                                    <div className="password d-flex flex-row">
                                                        <Field
                                                            id="password"
                                                            name="password"
                                                            type={this.state.showHidecurrentPassword ? "text" : "password"}
                                                            className="form-control"
                                                        />
                                                        <i
                                                            className={
                                                                this.state.showHidecurrentPassword
                                                                    ? "fa-solid fa-eye show-icon  "
                                                                    : "fa-solid fa-eye-slash show-icon "
                                                            }
                                                            onClick={() =>
                                                                this.setState({
                                                                    showHidecurrentPassword:
                                                                        !this.state.showHidecurrentPassword,
                                                                })
                                                            }
                                                        ></i>
                                                    </div>
                                                    <div className="text-danger">
                                                        <ErrorMessage name="password" />
                                                    </div>
                                                </div>

                                                <div className="row mb-3">
                                                    <div className="col-3">
                                                        <div className="profile-picture border">
                                                            <img
                                                                // src={this.state.profile}
                                                                alt=""
                                                                src={`https://avatars.dicebear.com/api/initials/${values.name}.svg`}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-9 d-flex flex-column justify-content-center">
                                                        <div>
                                                            <label
                                                                className="label"
                                                                htmlFor="profile_image"
                                                            >
                                                                {t('Profile Image')}
                                                            </label>
                                                            <div className="d-flex flex-row">
                                                                <label className="mt-1 choose_file" htmlFor="profile_image" >{t("Choose File")}</label>
                                                                <Field
                                                                    id="profile_image"
                                                                    name="profile_image"
                                                                    type="file"
                                                                    className="form-control"
                                                                    accept="image/*"
                                                                    style={{ "display": "none" }}
                                                                    onChange={(e) => {
                                                                        this.changeImage();
                                                                    }}
                                                                />
                                                                <div className="image_name ms-2 mt-2">
                                                                    {
                                                                        this.state.imageName ? this.state.imageName : t('Select File')
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="mt-3">
                                                            <label
                                                                className="label"
                                                                htmlFor="document"
                                                            >
                                                                {t('Document')}
                                                            </label>
                                                            <div className="d-flex flex-row">
                                                                <label className="mt-1 choose_file" htmlFor="document" >{t("Choose File")}</label>
                                                                <Field
                                                                    id="document"
                                                                    name="document"
                                                                    type="file"
                                                                    className="form-control"
                                                                    accept=".pdf"
                                                                    onChange={(e) => {
                                                                        this.changeDocument();
                                                                    }}
                                                                    style={{ "display": "none" }}
                                                                />
                                                                <div className="image_name ms-2 mt-2">
                                                                    {
                                                                        this.state.documentName ? this.state.documentName : t('Select File')
                                                                    }
                                                                </div>
                                                            </div>
                                                            <ErrorMessage name="document">
                                                                {(msg) => <div>{msg}</div>}
                                                            </ErrorMessage>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button
                                                    className="btn-navy ms-auto m-3 w-25"
                                                    type="submit"
                                                >
                                                    {t('Create')}
                                                </button>
                                            </Form>
                                        )
                                        }
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
)((CreateCleaner));
// export default CreateCleaner;
