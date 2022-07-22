import React, { Component } from 'react'
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from 'yup';
import { Modal } from 'bootstrap';
import Errormodal from "../../../common_component/errormodal/Errormodal"
import { connect } from "react-redux";
import { Translation } from 'react-i18next';
import { createProduct } from '../../api/POST';

const number = /^[0-9]{1,5}$/;
const validationSchema = yup.object().shape({
	name: yup.string().required("Name field is required!"),
	description: yup.string().required("Description field is required!"),
	stock: yup.string().matches(number, "number is not valid").required("Stock field is required!"),
	price: yup.string().test(
		'',
		'This field must be a decimal',
		value => (value + "").match(/^\d+(\.\d{1,2})?$/)
	).required("Price field is required!"),
});

class CreateProduct extends Component {

	constructor(props) {
		super(props);
		this.state = {
			errorMsg: ""
		}
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
						id="createProductModal"
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
											name: "",
											description: "",
											price: "",
											stock: "",
										}}

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

											console.log(values);
											this.showLoading()
											let fd = new FormData(document.getElementById("productForm"))
											createProduct(fd).then(
												res => {
													this.showLoading()
													if (res.data.Status) {
														console.log(res);
														this.updateStatus()
														this.props.getProductList();
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
										<Form id="productForm">
											<div className="mb-3">
												<label className="label" htmlFor="name">
													{t('Name')}
												</label>
												<Field
													id="name"
													name="name"
													type="text"
													className="form-control"
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
)((CreateProduct));
// export default CreateProduct