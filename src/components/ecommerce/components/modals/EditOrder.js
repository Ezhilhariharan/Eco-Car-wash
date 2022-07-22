import React, { Component } from 'react'
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from 'yup';
import { Modal } from 'bootstrap';
import Errormodal from "../../../common_component/errormodal/Errormodal"
import { connect } from "react-redux";
import { Translation } from 'react-i18next';
import { getOrderData } from '../../api/GET'
import { updateOrderData } from '../../api/PATCH';

const validationSchema = yup.object().shape({
	tracking_no: yup.string().required("Field is required!"),
	tracking_status: yup.string().required("Field is required!"),
});

class EditOrder extends Component {

	constructor(props) {
		super(props);
		this.state = {
			errorMsg: "",
			orderDetail: {
				tracking_no: "",
				tracking_status: "",
			}
		}
		this.modalRef = React.createRef()
		this.Errormodalref = React.createRef();
		this.showLoading = this.showLoading.bind(this);
	}

	componentDidMount() {
		getOrderData(this.props.orderID).then(
			res => {
				// console.log(res.data.Data);
				this.setState({
					orderDetail: res.data.Data
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
		this.props.resetOrderID()
	}
	updateStatus = () => {
		this.props.showtoast({
			text: "Uploaded Successfully ",
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
						ref={this.modalRef}
						tabIndex="-1"
					>
						<div className="modal-dialog">
							<div className="modal-content">
								<div className="modal-header">
									<h5 className="modal-title">{t('Edit Product')}</h5>
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
											tracking_no: this.state.orderDetail.tracking_no,
											tracking_status: this.state.orderDetail.tracking_status,
										}}
										enableReinitialize={true}
										// validationSchema={validationSchema}
										validationSchema={yup.object().shape({
											tracking_no: yup.string().required(t("required!")),
											tracking_status: yup.string().required(t("required!")),
										})}
										onSubmit={(values, onSubmitProps) => {
											this.showLoading()
											// console.log('form values',values);
											let fd = new FormData(document.getElementById("updateOrderForm"))
											updateOrderData(this.props.orderID, fd).then(
												res => {
													this.showLoading()
													// console.log('result', res);
													if (res.data.Status) {
														onSubmitProps.resetForm()
														this.hideModal();
														this.updateStatus()
														this.props.getAllOrderDetails()
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
										{({ errors, touched }) => (
											<Form id="updateOrderForm">
												<div className="mb-3">
													<label className="label" htmlFor="tracking_no">
														{t('Tracking No')}
													</label>
													<Field
														id="tracking_no"
														name="tracking_no"
														type="text"
														className="form-control"
														maxLength={20}
													/>
													<div className="text-danger">
														{/* <ErrorMessage
													name="tracking_no"
												/> */}
														{errors.tracking_no && touched.tracking_no ? (
															<div>{t('Feild is Required')}</div>
														) : null}
													</div>
												</div>

												<div className="mb-3">
													<label className="label" htmlFor="tracking_status">
														{t('Tracking Status')}
													</label>
													<Field
														id="tracking_status"
														name="tracking_status"
														as="select"
														className="form-control"
													>
														<option value="" label={t('Tracking Status')} />
														<option value="Order_Accepted" label={t('Order_Accepted')} />
														<option value="Dispatched" label={t('Dispatched')} />
														<option value="Delivered" label={t('Delivered')} />
													</Field>
													<div className="text-danger">
														{/* <ErrorMessage
													name="tracking_status"
												/> */}
														{errors.tracking_status && touched.tracking_status ? (
															<div>{t('Feild is Required')}</div>
														) : null}
													</div>
												</div>

												<button className="btn-navy mx-auto m-5" type='submit'>{t('Update')}</button>
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

		}, loading: (data) => {
			dispatch({ type: "Loading", loadingState: data.loadingState });
		},
	};
};
export default connect(
	null,
	mapDispatchToProps,
	null,
	{ forwardRef: true }
)(EditOrder);
// export default EditOrder