import React, { Component } from 'react'
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from 'yup';
import { Modal } from 'bootstrap';
import { Toast } from "primereact/toast";
import Errormodal from "../../common_component/errormodal/Errormodal"
import { connect } from "react-redux";
import { Translation } from 'react-i18next';

import { getManagerData } from '../api/GET';
import { patchManagerData } from '../api/PATCH';

const validationSchema = yup.object().shape({
	name: yup.string().required("Name field is required!").min(3, "Too Short!"),
	email: yup.string().email("Enter Valid email").required("Email field is required!"),
	mobile_no: yup.string().test("", "Enter Valid Mobile no", (value) =>
		(value + "").match(/^[\d\-\s]{6,18}$/)
	).required("Mobile number field is required!"),
	date_joined: yup.date().required("Date Joined field is required!"),
});

let logo;
class EditManager extends Component {

	constructor(props) {
		super(props);
		console.log(props);
		this.state = {
			name: "",
			email: "",
			mobile_no: "",
			date_joined: "",
			profile: "https://avatars.dicebear.com/api/initials/random.svg",
			errorMsg: "",
			image_file: ""
		}
		this.modalRef = React.createRef()
		this.Errormodalref = React.createRef();
		this.showError = this.showError.bind(this);
		this.changeImage = this.changeImage.bind(this);
		this.showLoading = this.showLoading.bind(this);
	}

	componentDidMount() {
		getManagerData(this.props.editedID).then(res => {
			console.log(res.data.Data);
			let date = new Date(res.data.Data.date_joined).toISOString().substr(0, 10);
			this.setState({
				name: res.data.Data.name,
				email: res.data.Data.email,
				mobile_no: res.data.Data.mobile_no,
				date_joined: date,
				profile: res.data.Data.profile_image
			})
		}).catch(err => console.log(err))
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
		this.props.resetEdit()
		this.setState({ image_file: "" })
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
		let file = document.getElementById('edit_profile_image').files[0];
		logo = document.getElementById('edit_profile_image').files[0];
		this.setState({ profile: file.name, image_file: logo })
		if (file) {
			if (file.size < 20971520) {
				var reader = new FileReader();
				reader.onload = () => {
					document.getElementById("profile_preview").src = reader.result;
					// this.setState({ profile: reader.result })
				}
				reader.readAsDataURL(file);
			} else {
				this.setState({ errorMsg: "Size Limit Exceeds" })
				this.Errormodalref.current.showModal()
			}
		}
	}
	updateStatus = () => {
		this.props.showtoast({
			text: "Uploaded Successfully ",
			time: new Date().getTime(),
		});
	};
	showLoading(props) {
		// console.log("values", props);
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
									<h5 className="modal-title">{t('Edit Manager')}</h5>
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
											name: this.state.name,
											email: this.state.email,
											mobile_no: this.state.mobile_no,
											date_joined: this.state.date_joined,
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
										})}
										onSubmit={(values, onSubmitProps) => {
											console.log(values);
											this.showLoading()
											let fd = new FormData(
												document.getElementById("editManagerForm")
											);
											if (this.state.image_file) {
												// console.log("in-img");
												fd.set("profile_image", this.state.image_file)
											} else {
												fd.delete("profile_image")
											}
											patchManagerData(this.props.editedID, fd).then(
												res => {
													console.log(res);
													if (res.data.Status) {
														onSubmitProps.resetForm();
														this.updateStatus()
														this.showLoading()
														this.setState({ profile: "https://avatars.dicebear.com/api/initials/random.svg" })
														this.props.resetManagerList();
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
										{({ values }) => (
											<Form id="editManagerForm">
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
															maxLength={25}
														// onBlur={
														// 	(e) =>
														// 		e.target.value != "" ?
														// 			this.setState(
														// 				{ profile: `https://avatars.dicebear.com/api/initials/${e.target.value}.svg` }
														// 			)
														// 			: false
														// }
														/>
														<div className="text-danger">
															<ErrorMessage
																name="name"
															/>
														</div>
													</div>

													<div className="col-6 mb-3">
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
												</div>

												<div className="row">
													<div className="col-6 mb-3">
														<label className="label" htmlFor="mobile_no">
															{t('Phone Number')}
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

													<div className="col-6 mb-3">
														<label className="label" htmlFor="date_joined">
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
															<ErrorMessage
																name="date_joined"
															/>
														</div>
													</div>
												</div>

												<div className="row">
													<div className="col-12 mb-3">
														<div className="row">
															<div className="col-3">
																<div className="profile-picture border">
																	<img src={`https://avatars.dicebear.com/api/initials/${values.name}.svg`} alt=""
																		id="profile_preview" />
																</div>
															</div>
															<div className="col-9 d-flex flex-column justify-content-center">
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
														</div>
													</div>
												</div>
												<button type="submit" className="btn-navy ms-auto m-3 w-25">
													{t('Update')}
												</button>
											</Form>
										)}
									</Formik>
								</div>
							</div>
						</div>
						<Errormodal ref={this.Errormodalref} message={this.state.errorMsg} />
					</div >
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
)(EditManager);
// export default EditManager