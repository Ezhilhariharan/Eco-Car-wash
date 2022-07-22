import React, { Component } from 'react'
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from 'yup';
import { Modal } from 'bootstrap';
import Errormodal from "../../../../common_component/errormodal/Errormodal";
import { connect } from "react-redux";
import { Translation } from 'react-i18next';
import { createCouponData } from '../api/POST';
import { getUsersForCoupon } from '../api/GET';

const validationSchema = yup.object().shape({
	code: yup.string().required("required!").min(3, "Too Short!").max(25, "Too Long!"),
	description: yup.string().required("Description field is required!").min(3, "Too Short!").max(200, "Too Long!"),
	discount_type: yup.string().required("Discount Type field is required!"),
	discount_amount: yup.string().test(
		'',
		'This field must be a decimal',
		value => (value + "").match(/^\d+(\.\d{1,2})?$/)
	).required("Discount Amount field is required!"),
	categories: yup.string().required("Categories field is required!")
});

class CreateCoupon extends Component {

	constructor(props) {
		super(props);
		this.state = {
			showSide: false,
			couponUsers: [],
			name: "",
			mobile_no: "",
			carType: "",
			carModel: "",
			carMake: "",
			errorMsg: "",
		}
		this.modalRef = React.createRef()
		this.getCouponUsers = this.getCouponUsers.bind(this)
		this.Errormodalref = React.createRef();
		this.showLoading = this.showLoading.bind(this)
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.couponType === 'Specific' && this.state.couponUsers.length === 0) {
			this.getCouponUsers()
		}
	}

	getCouponUsers() {
		getUsersForCoupon().then(
			res => {
				console.log(res.data.Data);
				this.setState({ couponUsers: res.data.Data })
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
					<div
						className="modal"
						id="createLeaveConfigModal"
						ref={this.modalRef}
						tabIndex="-1"
					>
						<div className={`modal-dialog ${this.state.showSide ? 'modal-xl' : null}`}>
							<div className="modal-content">
								<div className="modal-header">
									<h5 className="modal-title">{t('Add Coupons')}</h5>
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
											code: "",
											description: "",
											discount_type: "",
											discount_amount: "",
											categories: "",
											coupon_type: this.props.couponType,
										}}
										enableReinitialize={true}
										// validationSchema={validationSchema}
										validationSchema={yup.object().shape({
											code: yup.string().required(t("required!")).min(3, t('Too Short!')).max(25, t("Too Long!")),
											description: yup.string().required(t('Description field is required!')).min(3, t('Too Short!')).max(200, t("Too Long!")),
											discount_type: yup.string().required(t("Discount Type field is required!")),
											discount_amount: yup.string().test(
												'',
												t("This field must be a decimal"),
												value => (value + "").match(/^\d+(\.\d{1,2})?$/)
											).required(t("Price field is required!")),
											categories: yup.string().required(t("Categories field is required!"))
										})}
										onSubmit={(values, onSubmitProps) => {
											console.log(values);
											this.showLoading()
											let fd = new FormData(document.getElementById("createCoupon"))
											createCouponData(fd).then(
												res => {
													this.showLoading()
													if (res.data.Status) {
														console.log(res);
														this.hideModal();
														this.props.getCouponData();
														this.updateStatus()
														onSubmitProps.resetForm()
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
										<Form id="createCoupon">
											<div className={this.state.showSide ? 'row' : null}>
												<div className={this.state.showSide ? 'col-7 border-end' : null}>
													<div className="mb-3">
														<label className="label" htmlFor="code">
															{t('Coupon Code')}
														</label>
														<Field
															id="code"
															name="code"
															type="text"
															maxLength={25}
															className="form-control"
														/>
														<div className="text-danger">
															<ErrorMessage
																name="code"
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
															maxLength={200}
															className="form-control"
														/>
														<div className="text-danger">
															<ErrorMessage
																name="description"
															/>
														</div>
													</div>

													<div className="mb-3">
														<label className="label" htmlFor="categories">
															{t('Categories')}
														</label>
														<Field
															id="categories"
															name="categories"
															type="text"
															className="form-control"
														/>
														<div className="text-danger">
															<ErrorMessage
																name="categories"
															/>
														</div>
													</div>

													<div className="row mb-3">
														<div className="col-5">
															<label className="label" htmlFor="discount_type">
																{t('Discount Type')}
															</label>
															<Field
																name="discount_type"
																id="discount_type"
																as="select"
																className="form-select"
															>
																<option value="" label={t('Select Type')} />
																<option value="Percentage" label={t('Percentage')} />
																<option value="Amount" label={t('Amount')} />
															</Field>
															<div className="text-danger">
																<ErrorMessage
																	name="discount_type"
																/>
															</div>
														</div>
														<div className="col-7">
															<label className="label" htmlFor="discount_amount">
																{t('Discount Amount')}
															</label>
															<Field
																id="discount_amount"
																name="discount_amount"
																type="text"
																className="form-control"
																maxLength={8}
															/>
															<div className="text-danger">
																<ErrorMessage
																	name="discount_amount"
																/>
															</div>
														</div>
													</div>
													<Field
														id="coupon_type"
														name="coupon_type"
														type="hidden"
														className="form-control"
													/>
												</div>
												{
													this.state.showSide ?
														<div className="col-5">
															<div className="mb-3">
																<label className="label" htmlFor="user">
																	{t('Email')}
																</label>
																<Field
																	name="user"
																	id="user"
																	as="select"
																	className="form-select"
																	onChange={(e) => {
																		this.state.couponUsers.forEach(user => {
																			if (user.uuid === e.target.value) {
																				this.setState({
																					name: user.name,
																					mobile_no: user.mobile_no,
																					carType: user.car_type,
																					carModel: user.car_model,
																					carMake: user.car_make,
																				});
																			}
																		})

																	}}
																>
																	<option value="" label="Select User" />
																	{
																		this.state.couponUsers.length !== 0 ?
																			this.state.couponUsers.map((user, index) => {
																				return (
																					<option key={index} value={user.uuid} label={user.email} />
																				)
																			})
																			:
																			null
																	}
																</Field>
																<div className="text-danger">
																	<ErrorMessage
																		name="user"
																	/>
																</div>
															</div>
															<div className="mb-3">
																<label className="label" htmlFor="name">
																	{t('Name')}
																</label>
																<Field
																	id="name"
																	name="name"
																	type="text"
																	value={this.state.name}
																	className="form-control"
																	readOnly={true}
																/>
																<div className="text-danger">
																	<ErrorMessage
																		name="name"
																	/>
																</div>
															</div>
															<div className="mb-3">
																<label className="label" htmlFor="mobile_no">
																	{t('mobile no')}
																</label>
																<Field
																	id="mobile_no"
																	name="mobile_no"
																	type="text"
																	value={this.state.mobile_no}
																	className="form-control"
																	readOnly={true}
																/>
																<div className="text-danger">
																	<ErrorMessage
																		name="mobile_no"
																	/>
																</div>
															</div>
															<div className="mb-3 row">
																<div className="col-4">
																	<label className="label" htmlFor="car_type">
																		{t('Car Type')}
																	</label>
																	<Field
																		id="car_type"
																		name="car_type"
																		type="text"
																		value={this.state.carType}
																		className="form-control"
																		readOnly={true}
																	/>
																</div>
																<div className="col-4">
																	<label className="label" htmlFor="carMake">
																		{t('Car Make')}
																	</label>
																	<Field
																		id="carMake"
																		name="carMake"
																		type="text"
																		value={this.state.carMake}
																		className="form-control"
																		readOnly={true}
																	/>
																</div>
																<div className="col-4">
																	<label className="label" htmlFor="carModel">
																		{t('Car Type')}
																	</label>
																	<Field
																		id="carModel"
																		name="carModel"
																		type="text"
																		value={this.state.carModel}
																		className="form-control"
																		readOnly={true}
																	/>
																</div>
															</div>
														</div>
														:
														null
												}
												{
													this.props.couponType === 'Specific' && !this.state.showSide ?
														<div
															className="btn-navy mx-auto m-5"
															onClick={() => {
																// if ( this.state.couponUsers.length === 0 ){
																// this.getCouponUsers()
																// }
																this.setState({ showSide: true })
															}}
														>
															{t('Add User')}
														</div>
														:
														<button
															className="btn-navy my-5 mx-auto"
															type='submit'
															{
															...(this.props.couponType === 'Specific' && this.state.showSide ?
																{ style: { width: '50%' } }
																: null)
															}
														>
															{t('Create')}
														</button>
												}
											</div>
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
)((CreateCoupon));
// export default CreateCoupon