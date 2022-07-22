import React, { Component } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { Modal } from "bootstrap";
import { Toast } from "primereact/toast";
import Errormodal from "../../../../common_component/errormodal/Errormodal";
import { getCleanerData } from "../api/GET";
import { patchCleanerData } from "../api/PATCH";
import { connect } from "react-redux";
import { Translation } from 'react-i18next';

const validationSchema = yup.object().shape({
    name: yup.string().required("Name field is required!"),
    email: yup.string().email("Enter Valid email").required("Email field is required!"),
    mobile_no: yup.string().test("", "Enter Valid Mobile no", (value) =>
        (value + "").match(/^[\d\-\s]{6,18}$/)
    ).required("Mobile number field is required!"),
    date_joined: yup.date().required("Date Joined field is required!"),
    // password: yup.string().required("required!"),
});

let doc, profileImage;
class EditCleaner extends Component {
    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            name: "",
            email: "",
            mobile_no: "",
            date_joined: "",
            errorMsg: "",
            profile: "https://avatars.dicebear.com/api/initials/random.svg",
            document: "",
            profile_image: "",
            document_file: "",
            image_file: "",
            showHidecurrentPassword: false,
        };
        this.modalRef = React.createRef();
        this.Errormodalref = React.createRef();
        this.showError = this.showError.bind(this);
        this.changeImage = this.changeImage.bind(this);
        this.showLoading = this.showLoading.bind(this);
    }

    componentDidMount() {
        getCleanerData(this.props.editedID).then(res => {
            console.log("edit cleaner", res.data.Data, res.data.Data.profile_image, res.data.Data.document);
            if (res.data.Status) {
                let date = new Date(res.data.Data.date_joined).toISOString().substring(0, 10)
                this.setState({
                    name: res.data.Data.name,
                    email: res.data.Data.email,
                    mobile_no: res.data.Data.mobile_no,
                    date_joined: date,
                    profile: res.data.Data.profile_image,
                    profile_image: res.data.Data.profile_image,
                    document: res.data.Data.document
                })
                // document.getElementById("edit_profile_image").value = res.data.Data.profile_image
            }
        }).catch(err => console.log(err))
        // console.log("edit_profile_image", document.getElementById("edit_profile_image").value);
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
        this.props.resetEdit();
        this.setState({ document_file: "", image_file: "" });
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
        let file = document.getElementById("edit_profile_image").files[0];
        profileImage = document.getElementById("edit_profile_image").files[0];
        this.setState({ image_file: profileImage })
        if (file.size < 20971520) {
            if (file) {
                this.setState({ profile: file.name, profile_image: file, });
                var reader = new FileReader();
                reader.onload = () => {
                    document.getElementById("profile_preview").src = reader.result;
                    // console.log("reader.result", reader.result);
                    // this.setState({ profile: reader.result });
                };
                reader.readAsDataURL(file);
            }
        } else {
            console.log("Too Big");
            this.setState({ errorMsg: "Size Limit Exceeds" })
            this.Errormodalref.current.showModal()
        }
    }

    changeDocument() {
        let file = document.getElementById("edit_document").files[0];
        doc = document.getElementById("edit_document").files[0];
        this.setState({ document_file: doc })
        if (file.size < 2097152) {
            if (file) {
                this.setState({ document: file.name });
                var reader = new FileReader();
                reader.onload = () => {
                    // this.setState({ document: reader.result })
                };
                reader.readAsDataURL(file);
            }
        } else {
            console.log("Too Big");
            this.setState({ errorMsg: "Size Limit Exceeds" })
            this.Errormodalref.current.showModal()
        }
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
                        id="createLeaveConfigModal"
                        ref={this.modalRef}
                        tabIndex="-1"
                    >
                        <Toast ref={(el) => (this.toast = el)} />
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">{t('Edit Cleaner')}</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => this.hideModal()}
                                        aria-label="Close"
                                    ></button>
                                </div>
                                <div className="modal-body edit_cleaner mx-5">
                                    <Formik
                                        initialValues={{
                                            name: this.state.name,
                                            email: this.state.email,
                                            mobile_no: this.state.mobile_no,
                                            date_joined: this.state.date_joined,
                                            password: "",
                                            // profile_image: this.state.profile,
                                            // document: this.state.document,
                                        }}
                                        enableReinitialize={true}
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
                                            this.showLoading()
                                            let fd = new FormData(
                                                document.getElementById("editCleanerForm")
                                            );
                                            if (this.state.document_file) {
                                                console.log("in-dic");
                                                fd.set("document", this.state.document_file)
                                            } else {
                                                fd.delete("document")
                                            }
                                            if (this.state.image_file) {
                                                console.log("in-img");
                                                fd.set("profile_image", this.state.image_file)
                                            } else {
                                                fd.delete("profile_image")
                                            }
                                            if (values.password) {
                                                fd.set("password", values.password)
                                            } else {
                                                fd.delete("password")
                                            }
                                            patchCleanerData(this.props.editedID, fd).then(
                                                res => {
                                                    this.showLoading()
                                                    console.log(res);
                                                    if (res.data.Status) {
                                                        onSubmitProps.resetForm();
                                                        this.updateStatus()
                                                        this.setState({ profile: "https://avatars.dicebear.com/api/initials/random.svg" })
                                                        this.hideModal();
                                                        this.props.resetCleanerList();
                                                    } else {
                                                        this.setState({ errorMsg: res.data.Message })
                                                        this.Errormodalref.current.showModal()
                                                    }
                                                },
                                                error => {
                                                    this.showLoading()
                                                    console.log(error);
                                                    if (!error.response.data.Status) {
                                                        if (error.response.data.hasOwnProperty('Message')) {
                                                            this.setState({ errorMsg: error.response.data.Message })
                                                            this.Errormodalref.current.showModal()
                                                        }
                                                    }
                                                }
                                            )
                                        }}
                                    >
                                        {({ values }) => (
                                            <Form id="editCleanerForm">
                                                <div className="row">
                                                    <div className="col-6 mb-3">
                                                        <label className="label" htmlFor="name">
                                                            {t('Name')}
                                                        </label>
                                                        <Field
                                                            id="name"
                                                            name="name"
                                                            type="text"
                                                            className="form-control"
                                                        // onBlur={
                                                        //     (e) =>
                                                        //         e.target.value != "" ?
                                                        //             this.setState(
                                                        //                 { profile: `https://avatars.dicebear.com/api/initials/${e.target.value}.svg` }
                                                        //             )
                                                        //             : false
                                                        // }
                                                        />
                                                        <div className="text-danger">
                                                            <ErrorMessage
                                                                name="name"
                                                            />
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
                                                    < div className="password d-flex flex-row">
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
                                                </div>
                                                <div className="row mb-3">
                                                    <div className="col-3">
                                                        <div className="profile-picture border">
                                                            <img id="profile_preview" src={`https://avatars.dicebear.com/api/initials/${values.name}.svg`} alt="" />
                                                        </div>
                                                    </div>
                                                    <div className="col-9 d-flex flex-column justify-content-center">
                                                        <div>
                                                            <label className="label" htmlFor="edit_profile_image">
                                                                {t('Profile Image')}
                                                            </label>

                                                            <div className="d-flex flex-row">
                                                                <label className="mt-1 choose_file" htmlFor="edit_profile_image" >{t("Choose File")}</label>
                                                                <Field
                                                                    id="edit_profile_image"
                                                                    name="profile_image"
                                                                    type="file"
                                                                    className="form-control image"
                                                                    onChange={(e) => {
                                                                        this.changeImage()
                                                                    }}
                                                                    accept="image/*"
                                                                    style={{ "display": "none" }}
                                                                />
                                                                <div className="image_name ms-2 mt-2">
                                                                    {
                                                                        this.state.profile ? this.state.profile : t('Select File')
                                                                    }
                                                                </div>
                                                            </div>

                                                        </div>
                                                        <div className="mt-3">
                                                            <label className="label" htmlFor="edit_document">
                                                                Document
                                                            </label>
                                                            <div className="d-flex flex-row">
                                                                <label className="mt-1 choose_file" htmlFor="edit_document" >{t("Choose File")}</label>
                                                                <Field
                                                                    id="edit_document"
                                                                    name="document"
                                                                    type="file"
                                                                    className="form-control image"
                                                                    // value={}
                                                                    style={{ "display": "none" }}
                                                                    onChange={e => {
                                                                        this.changeDocument()
                                                                    }}
                                                                    accept="application/pdf"
                                                                />
                                                                <div className="image_name ms-2 mt-2">
                                                                    {
                                                                        this.state.document ? this.state.document : t('Select File')
                                                                    }
                                                                </div>
                                                            </div>
                                                            <ErrorMessage name="document">
                                                                {(msg) => <div>{msg}</div>}
                                                            </ErrorMessage>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Field
                                                    id="user_type"
                                                    name="user_type"
                                                    value="3"
                                                    type="hidden"
                                                    className="form-control"
                                                />

                                                <button
                                                    type="submit"
                                                    className="btn-navy ms-auto m-3 w-25"
                                                >
                                                    {t('Update')}
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
            // console.log("Loading", data);
            dispatch({ type: "Loading", loadingState: data.loadingState });
        },
    };
};
export default connect(
    null,
    mapDispatchToProps,
    null,
    { forwardRef: true }
)(EditCleaner);
// export default EditCleaner;
