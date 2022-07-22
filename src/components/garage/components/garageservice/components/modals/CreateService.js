import React, { Component } from 'react'
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from 'yup';
import { Modal } from 'bootstrap';
import { Toast } from "primereact/toast";
import { connect } from "react-redux";
import Errormodal from "../../../../../common_component/errormodal/Errormodal"
import { Translation } from 'react-i18next';
import { getServiceData } from '../../api/GET'
import { postService } from '../../api/POST';

const validationSchema = yup.object().shape({
	service: yup.string().required("Title field is required!"),
	// price: yup.string().test(
	// 	'',
	// 	'This field must be a decimal',
	// 	value => (value + "").match(/^[0-9]*\.*[0-9]+$/)
	//   ).required("Price field is required!"),
	price: yup.string().test(
		'',
		'This field must be a decimal',
		value => (value + "").match(/^\d+(\.\d{1,2})?$/)
	).required("Price field is required!")
});

class CreateService extends Component {
	constructor(props) {
		super(props);
		this.state = {
			serviceList: [],
			errorMsg: ""
		}
		console.log('props', this.props);
		this.modalRef = React.createRef()
		this.Errormodalref = React.createRef();
		this.showError = this.showError.bind(this);
		this.showLoading = this.showLoading.bind(this);
	}

	componentDidMount() {
		getServiceData(
			this.props.carType,
			this.props.serviceType,
			this.props.serviceNature
		).then(res => {
			// console.log(res.data.Data);
			this.setState({ serviceList: res.data.Data });
		}).catch(err => console.log(err))
	}

	componentDidUpdate(prevProps) {
		if ((this.props.carType !== prevProps.carType && this.props.carType !== "" && prevProps.carType !== "") || (this.props.serviceType !== prevProps.serviceType && this.props.serviceType !== "" && prevProps.serviceType !== "")) {
			getServiceData(
				this.props.carType,
				this.props.serviceType,
				this.props.serviceNature
			).then(res => {
				// console.log(res.data.Data);
				this.setState({ serviceList: res.data.Data });
			}).catch(err => console.log(err))
		}
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

	showError(errTitle, errMsg) {
		this.toast.show({
			severity: "error",
			summary: errTitle,
			detail: errMsg,
			life: 3000,
		});
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
						className="modal fade"
						ref={this.modalRef}
						tabIndex="-1"
					>
						<Toast ref={(el) => (this.toast = el)} />
						<div className="modal-dialog">
							<div className="modal-content">
								<div className="modal-header">
									<h5 className="modal-title">{t('Add Service')}</h5>
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
											service: "",
											price: "",
											garage: this.props.garage,
										}}

										validationSchema={validationSchema}
										enableReinitialize={true}
										onSubmit={(values, onSubmitProps) => {
											// console.log(values);
											this.showLoading()
											let fd = new FormData(document.getElementById(`service${this.props.serviceNature}Form`))
											postService(fd).then(
												res => {
													console.log(res);
													this.showLoading()
													if (res.data.Status) {
														this.hideModal();
														this.props.getServiceData(this.props.serviceNature);
														this.updateStatus()
														onSubmitProps.resetForm()
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
										<Form id={`service${this.props.serviceNature}Form`}>
											<div className="mb-3">
												{/* {this.props.serviceType}
										{this.props.serviceNature}
										{this.props.carType} */}
												<label className="label" htmlFor="service">
													{t('Service')}
												</label>
												<Field
													id="service"
													name="service"
													as="select"
													className="form-control"
												>
													<option value="">{t('Select Service')}</option>
													{
														this.state.serviceList.map((service, index) => {
															return (
																<option key={index} value={service.id}>{service.title} - {service.price}</option>
															)
														})
													}
												</Field>
												<div className="text-danger">
													<ErrorMessage
														name="service"
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
													maxlength={11}
												/>
												<div className="text-danger">
													<ErrorMessage
														name="price"
													/>
												</div>
											</div>

											<Field
												id="garage"
												name="garage"
												type="hidden"
												className="form-control"
											/>
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
)(CreateService);
// export default CreateService