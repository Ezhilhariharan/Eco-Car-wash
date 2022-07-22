import React, { Component } from 'react'
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from 'yup';
import { Modal } from 'bootstrap';
import Errormodal from "../../../common_component/errormodal/Errormodal"
import { connect } from "react-redux";
import { updateProduct } from '../../api/PATCH';
import { Translation } from 'react-i18next';

const number = /^[0-9]{1,5}$/;
const validationSchema = yup.object().shape({
	name: yup.string().required("Name field is required!").min(3, "Too Short!"),
	description: yup.string().required("Description field is required!"),
	stock: yup.string().matches(number, "number is not valid").required("Stock field is required!"),
	price: yup.string().test(
		'',
		'This field must be a decimal',
		value => (value + "").match(/^\d+(\.\d{1,2})?$/)
	).required("Price field is required!"),
});
// /^\d*\.{1}\d*$/
///^[0-9]*\.*[0-9]+$/ dany
class EditProduct extends Component {

	constructor(props) {
		super(props);
		this.state = {
			id: "",
			name: "",
			description: "",
			price: "",
			stock: "",
			errorMsg: ""

		}
		this.modalRef = React.createRef()
		this.Errormodalref = React.createRef();
		this.showLoading = this.showLoading.bind(this);
	}

	componentDidMount() {
		// console.log('product id',this.props.product);
		this.setState({
			id: this.props.product.id,
			name: this.props.product.name,
			description: this.props.product.description,
			price: this.props.product.price,
			stock: this.props.product.stock,
			total_count: this.props.product.total_count,
			total_price: this.props.product.total_price,
		})
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
									<h5 className="modal-title" >{t('Edit Product')}</h5>
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
											description: this.state.description,
											price: this.state.price,
											stock: this.state.stock,
										}}
										enableReinitialize={true}
										// validationSchema={validationSchema}
										validationSchema={yup.object().shape({
											name: yup.string().required(t("Name field is required!")).min(3, t('Too Short!')),
											description: yup.string().required(t('Description field is required!')),
											stock: yup.string().matches(number, t('number is not valid')).required(t('Stock field is required!')),
											price: yup.string().test(
												'',
												t("This field must be a decimal"),
												value => (value + "").match(/^\d+(\.\d{1,2})?$/)
											).required(t("Price field is required!")),
										})}
										onSubmit={(values, onSubmitProps) => {
											this.showLoading()
											// console.log('form values',values);
											let fd = new FormData(document.getElementById("updateProductForm"))
											updateProduct(this.state.id, fd).then(
												res => {
													console.log('result', res);
													if (res.data.Status) {
														this.props.updateProductData({
															id: this.state.id,
															name: values.name,
															description: values.description,
															price: values.price,
															stock: values.stock,
															total_count: this.state.total_count,
															total_price: this.state.total_price,
														});
														this.updateStatus()
														this.showLoading()
														onSubmitProps.resetForm()
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
										<Form id="updateProductForm">
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
													<ErrorMessage
														name="name"
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

											<div className="mb-3">
												<label className="label" htmlFor="price">
													{t('Price')}
												</label>
												<Field
													id="price"
													name="price"
													type="text"
													className="form-control"
													maxLength={11}
												/>
												<div className="text-danger">
													<ErrorMessage
														name="price"
													/>
												</div>
											</div>
											<div className="mb-3">
												<label className="label" htmlFor="stock">
													{t('Stock')}
												</label>
												<Field
													id="stock"
													name="stock"
													type="text"
													className="form-control"
												/>
												<div className="text-danger">
													<ErrorMessage
														name="stock"
													/>
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
// text: "Updated Successfully ",
//   time: new Date().getTime()
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
)(EditProduct);
// export default EditProduct