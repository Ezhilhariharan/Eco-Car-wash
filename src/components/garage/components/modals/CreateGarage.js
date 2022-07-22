import React, { Component } from 'react'
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from 'yup';
import { Modal } from 'bootstrap';
import { connect } from "react-redux";
import Errormodal from "../../../common_component/errormodal/Errormodal";
import { Translation } from 'react-i18next';
import { createGarage } from '../../api/POST';

const validationSchema = yup.object().shape({
	name: yup.string().required("Name field is required!"),
	email: yup.string().email("Enter Valid Email!").required("Email field is required!"),
	mobile_no: yup.string().test("", "Enter Valid Mobile no", (value) =>
		(value + "").match(/^[\d+-\s]{6,18}$/)
	).required("Mobile number field is required!"),
	address: yup.string().required("address field is required!"),
	description: yup.string().required("Description field is required!"),
});

class CreateGarage extends Component {

	constructor(props) {
		super(props);
		this.state = {
			profile: "https://avatars.dicebear.com/api/initials/random.svg",
			errorMsg: "",
			filename: "",
			imgfile: "",
		};
		this.modalRef = React.createRef()
		this.Errormodalref = React.createRef();
		this.showLoading = this.showLoading.bind(this);
	}

	showModal() {
		const modalEle = this.modalRef.current
		const bsModal = new Modal(modalEle, {
			backdrop: 'static',
			keyboard: false
		})
		bsModal.show()
	}

	hideModal() {
		const modalEle = this.modalRef.current
		const bsModal = Modal.getInstance(modalEle)
		bsModal.hide()
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
	changeImage = () => {
		let file = document.getElementById("image").files[0];
		if (file) {
			if (file.size < 20971520) {
				this.setState({ filename: file.name, imgfile: file })
				var reader = new FileReader();
				reader.onload = () => {

				};
				reader.readAsDataURL(file);
			} else {
				this.setState({ errorMsg: "Size Limit Exceeds", filename: "" })
				this.Errormodalref.current.showModal()
			}
		}
	}
	render() {
		return (
			<Translation>{
				(t, { i18n }) =>
					<div
						className="modal"
						id="createProductModal"
						ref={this.modalRef}
						tabIndex="-1"
					>
						<div className="modal-dialog modal-lg">
							<div className="modal-content">
								<div className="modal-header">
									<h5 className="modal-title">{t('Add Product')}</h5>
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
											profile_image: "",
											address: "",
											mobile_no: "",
											description: "",
										}}
										// validationSchema={validationSchema}
										validationSchema={yup.object().shape({
											name: yup.string().required(t("Name field is required!")).min(3, t('Too Short!')),
											email: yup.string().email(t('Enter Valid email address!')).required(t('Email field is required!')),
											mobile_no: yup.string().test("", t('Enter Valid Mobile no'), (value) =>
												(value + "").match(/^[\d\-\s]{6,18}$/)
											).required(t('Mobile number field is required!')),
											address: yup.string().required(t('Address field is required!')),
											description: yup.string().required(t('Description field is required!')),
										})}
										onSubmit={(values, onSubmitProps) => {
											this.showLoading()
											console.log(values);
											let fd = new FormData(document.getElementById("garageForm"))
											if (this.state.imgfile) {
												fd.set("profile_image", this.state.imgfile)
											} else {
												fd.delete("profile_image")
											}
											createGarage(fd).then(
												res => {
													this.showLoading()
													if (res.data.Status) {
														console.log(res);
														this.props.setGarageList(true);
														onSubmitProps.resetForm()
														this.updateStatus()
														this.hideModal();
													} else {
														this.setState({ errorMsg: res.data.Message })
														this.Errormodalref.current.showModal()
													}
												},
												error => {
													this.showLoading()
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
										<Form id="garageForm">
											<div className="d-flex flex-row">
												<div className="mb-3 col-6">
													<label className="label" htmlFor="name">
														{t('Name')}
													</label>
													<Field
														id="name"
														name="name"
														type="text"
														className="form-control"
														maxLength={20}
													/>
													<div className="text-danger">
														<ErrorMessage
															name="name"
														/>
													</div>
												</div>
												<div className="mb-3 ps-3 col-6">
													<label className="label" htmlFor="mobile_no">
														{t('mobile no')}
													</label>
													<Field
														id="mobile_no"
														name="mobile_no"
														type="text"
														className="form-control"
													/>
													<div className="text-danger">
														<ErrorMessage
															name="mobile_no"
														/>
													</div>
												</div>
											</div>
											<div className="mb-3">
												<label className="label" htmlFor="email">
													{t('Email')}
												</label>
												<Field
													id="email"
													name="email"
													type="email"
													className="form-control"
												/>
												<div className="text-danger">
													<ErrorMessage
														name="email"
													/>
												</div>
											</div>
											<div className="mb-3">
												<label className="label" htmlFor="image">
													{t('Image')}
												</label>
												<div className="d-flex flex-row">
													<label className="mt-1 choose_file" htmlFor="image" >{t("Choose File")}</label>
													<Field
														id="image"
														name="profile_image"
														type="file"
														className="form-control image"
														// accept="image/jpeg, image/png, image/heic, image/heif, image/jpg"
														accept="image/*"
														onChange={this.changeImage}
														style={{ "display": "none" }}
													/>
													<div className="ms-2 mt-2">
														{
															this.state.filename ? this.state.filename : t('Select File')
														}
													</div>
												</div>
												<ErrorMessage name="profile_image">
													{(msg) => <small className="text-danger">{msg}</small>}
												</ErrorMessage>
											</div>
											<div className="mb-3">
												<label className="label" htmlFor="name">
													{t('Address')}
												</label>
												<Field
													id="address"
													name="address"
													as="textarea"
													className="form-control"
													maxLength={200}
												/>
												<div className="text-danger">
													<ErrorMessage
														name="address"
													/>
												</div>
											</div>
											<div className="mb-3">
												<label className="label" htmlFor="description">
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
													<ErrorMessage
														name="description"
													/>
												</div>
											</div>

											<button className="btn-navy mx-auto m-5" type='submit'>{t('Create')}</button>
										</Form>
									</Formik>
								</div>
							</div>
						</div>
						<Errormodal ref={this.Errormodalref} message={this.state.errorMsg} />
					</div>
			}
			</Translation>
		)
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
)((CreateGarage));
// export default CreateGarage