import React, { Component } from 'react'
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from 'yup';
import { Modal } from 'bootstrap';
import Errormodal from "../../../../common_component/errormodal/Errormodal";
import { connect } from "react-redux";
import { Translation } from 'react-i18next';
import { getCouponData } from '../api/GET';
import { updateCouponData } from '../api/PATCH';

const validationSchema = yup.object().shape({
	code: yup.string().required("Name field is required!"),
	description: yup.string().required("Description field is required!"),
	discount_type: yup.string().required("Discount Type field is required!"),
	discount_amount: yup.string().test(
		'',
		'This field must be a decimal',
		value => (value + "").match(/^\d+(\.\d{1,2})?$/)
	).required("Discount Amount field is required!"),
	categories: yup.string().required("Categories field is required!")
});

class EditCoupon extends Component {

	constructor(props) {
		super(props);
		this.state = {
			code: "",
			description: "",
			discount_type: "",
			discount_amount: "",
			categories: "",
			errorMsg: "",
		}
		this.modalRef = React.createRef()
		this.Errormodalref = React.createRef();
		this.showLoading = this.showLoading.bind(this)
	}

	componentDidMount() {
		getCouponData(this.props.editCoupon).then(res => {
			console.log(res.data.Data);
			this.setState({
				code: res.data.Data.code,
				description: res.data.Data.description,
				discount_type: res.data.Data.discount_type,
				discount_amount: res.data.Data.discount_amount,
				categories: res.data.Data.categories
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
		// this.props.editCouponData("")
	}
	updateStatus = () => {
		this.props.showtoast({
			text: "updated Successfully ",
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
						<div className="modal-dialog">
							<div className="modal-content">
								<div className="modal-header">
									<h5 className="modal-title">{t('Edit Coupons')}</h5>
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
											code: this.state.code,
											description: this.state.description,
											discount_type: this.state.discount_type,
											discount_amount: this.state.discount_amount,
											categories: this.state.categories,
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
											let fd = new FormData(document.getElementById("editCoupon"))
											updateCouponData(this.props.editCoupon, fd).then(
												res => {
													this.showLoading()
													if (res.data.Status) {
														console.log(res);
														this.updateStatus()
														onSubmitProps.resetForm()
														this.hideModal();
														this.props.getCouponData();
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
										<Form id="editCoupon">
											<div className="mb-3">
												<label className="label" htmlFor="code">
													{t('Coupon Code')}
												</label>
												<Field
													id="code"
													name="code"
													type="text"
													className="form-control"
													maxLength={25}
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
											<div className="row">
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
														maxLength={8}
														className="form-control"
													/>
													<div className="text-danger">
														<ErrorMessage
															name="discount_amount"
														/>
													</div>
												</div>
											</div>
											<button className="btn-navy mx-auto m-5" type='submit'>{t('Update')}</button>
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
)((EditCoupon));
// export default EditCoupon