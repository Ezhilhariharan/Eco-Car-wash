import React, { Component } from 'react'
import { Modal } from 'bootstrap';
import { getAllServices } from "../api/GET";
import { withTranslation } from 'react-i18next';
import { Translation } from 'react-i18next';

import "./styles/CarTypeServicesModal.scss"

let assignArray = []
class CarTypeServicesModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			servicesList: [],
			standardInteriorServicesList: [],
			premiumInteriorServicesList: [],
			standardExteriorServicesList: [],
			premiumExteriorServicesList: [],
			storeServicesList: [],
			serviceType: "Interior",
		}
		this.modalRef = React.createRef()
		this.saveServices = this.saveServices.bind(this)
	}
	componentDidMount() {
		// let assignArray = this.props.storeServicesList
		if (this.props.storeServicesList.length > 0) {
			this.props.storeServicesList.map(x => {
				assignArray.push({ ...x })
			})
			this.setState({ storeServicesList: assignArray })
		}
		console.log("storeServicesList", Object.assign({}, ...this.props.storeServicesList), this.props.storeServicesList.length);


		getAllServices(this.props.selectedCarTypeID).then(
			res => {
				// console.log("getAllServices", res.data.Data);
				this.setState({ servicesList: res.data.Data })
				for (let i of res.data.Data) {
					// console.log(i);
					if (i.service_nature == "Standard") {
						if (i.service_type == "Interior") {
							this.setState({
								standardInteriorServicesList: [...this.state.standardInteriorServicesList, i]
							})
						} else {
							this.setState({
								standardExteriorServicesList: [...this.state.standardExteriorServicesList, i]
							})
						}
					} else {
						if (i.service_type == "Interior") {
							this.setState({
								premiumInteriorServicesList: [...this.state.premiumInteriorServicesList, i]
							})
						} else {
							this.setState({
								premiumExteriorServicesList: [...this.state.premiumExteriorServicesList, i]
							})

						}
					}
				}

			},
			err => console.log(err)
		)
	}

	componentWillUnmount() {
		console.log("componentWillUnmount");
		this.setState({ storeServicesList: [] })
		assignArray = []
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
		bsModal.hide();
		this.props.resetSelectedCarType();
		this.props.closeModal()

	}

	saveServices() {
		this.props.setStoreServicesList(this.state.storeServicesList)
		this.hideModal()
	}

	updateService(serviceID, checked) {
		console.log("serviceID", serviceID, "is_enabled", checked);
		let storeServicesList_let = this.state.storeServicesList
		let i = storeServicesList_let.findIndex(x => x.service.id == serviceID)
		if (checked) {
			// storeServicesList_let[i].is_enabled = checked
			// console.log("cool");
			storeServicesList_let.push({
				service: {
					id: serviceID,
					title: this.state.servicesList.find(x => x.id == serviceID).title,
					service_nature: this.state.servicesList.find(x => x.id == serviceID).service_nature,
					service_type: this.state.servicesList.find(x => x.id == serviceID).service_type,
					car_type: this.state.servicesList.find(x => x.id == serviceID).car_type,
				},
				is_enabled: true,
				store: this.props.storeID
			})
		} else {
			storeServicesList_let.splice(i, 1)
			// storeServicesList_let.push({
			// 	service: {
			// 		id: serviceID,
			// 		title: this.state.servicesList.find(x => x.id == serviceID).title,
			// 		service_nature: this.state.servicesList.find(x => x.id == serviceID).service_nature,
			// 		service_type: this.state.servicesList.find(x => x.id == serviceID).service_type,
			// 		car_type: this.state.servicesList.find(x => x.id == serviceID).car_type,
			// 	},
			// 	is_enabled: true,
			// 	store: this.props.storeID
			// })
		}
		console.log(storeServicesList_let);
		this.setState({ storeServicesList: storeServicesList_let })
	}
	save = () => {
		this.props.setStoreServicesList(this.state.storeServicesList)
	}
	render() {
		// const { t } = this.props
		return (
			<Translation>{
				(t, { i18n }) =>
					<div
						className="modal"
						ref={this.modalRef}
						tabIndex="-1"
					>
						<div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-dialog modal-xl">
							<div className="modal-content">
								<div className="modal-header" style={{ position: "relative" }}>
									<h5 className="modal-title mx-auto">
										{t('Car Type')}: {this.props.selectedCarTypeName}
									</h5>
									<button
										type="button"
										className="btn-close"
										onClick={() => this.hideModal()}
										aria-label="Close"
										style={{ position: "absolute", top: "25px", right: "20px" }}
									></button>
								</div>
								<div className="modal-body cartype-services-modal p-0 m-0">
									<div className="servicetype-selection-container">
										<div
											className={`servicetype ${(this.state.serviceType == "Interior") ? "selected" : null}`}
											onClick={() => this.setState({ serviceType: "Interior" })}
										>
											{t('Interior')}
										</div>
										<div
											className={`servicetype ${(this.state.serviceType == "Exterior") ? "selected" : null}`}
											onClick={() => this.setState({ serviceType: "Exterior" })}
										>
											{t('Exterior')}
										</div>
									</div>
									{
										{
											"Interior":
												<div className="servicetype-container">
													<div className="service-nature-container">
														<div className="service-nature-header">
															{t('Standard')}
														</div>
														<div className="service-nature-list">
															{
																(this.state.standardInteriorServicesList.length > 0) ?
																	this.state.standardInteriorServicesList.map((i, index) => {

																		return (
																			<div className="service-item" key={index}>
																				<input
																					type="checkbox"
																					id={i.id}
																					checked={
																						this.state.storeServicesList.length > 0 ?
																							this.state.storeServicesList.find(x => (x.service.id === i.id && x.service.car_type === this.props.selectedCarTypeID) && x.service.service_type === i.service_type)
																								// != -1
																								?
																								// true
																								this.state.storeServicesList.filter(
																									j => j.service.id === i.id
																								).length > 0
																								: false
																							: false
																						// check_box
																					}

																					onChange={(e) => {

																						let is_enabled = e.target.checked
																						this.updateService(i.id, is_enabled)
																					}}
																				/>
																				<label htmlFor={i.id}>{i.title}</label>
																			</div>
																		)
																	})
																	: null
															}
														</div>
													</div>
													<div className="service-nature-container">
														<div className="service-nature-header">
															{t('Premium')}
														</div>
														<div className="service-nature-list">
															{
																(this.state.premiumInteriorServicesList.length > 0) ?
																	this.state.premiumInteriorServicesList.map((i, index) => {
																		return (
																			<div className="service-item" key={index}>
																				<input
																					type="checkbox"
																					id={i.id}
																					checked={
																						this.state.storeServicesList.length > 0 ?
																							this.state.storeServicesList.find(x => (x.service.id === i.id && x.service.car_type === this.props.selectedCarTypeID) && x.service.service_type === i.service_type)
																								// != -1 
																								?
																								this.state.storeServicesList.filter(
																									j => j.service.id === i.id
																								).length > 0
																								// true
																								: false
																							: false
																					}
																					onChange={(e) => {
																						let is_enabled = e.target.checked
																						this.updateService(i.id, is_enabled)
																					}}
																				/>
																				<label htmlFor={i.id}>{i.title}</label>
																			</div>
																		)
																	})
																	: null
															}
														</div>
													</div>
												</div>,
											"Exterior":
												<div className="servicetype-container">
													<div className="service-nature-container">
														<div className="service-nature-header">
															{t('Standard')}
														</div>
														<div className="service-nature-list">
															{
																(this.state.standardExteriorServicesList.length > 0) ?
																	this.state.standardExteriorServicesList.map((i, index) => {

																		return (
																			<div className="service-item" key={index}>
																				<input
																					type="checkbox"
																					id={i.id}
																					checked={
																						this.state.storeServicesList.length > 0 ?
																							this.state.storeServicesList.find(x => (x.service.id === i.id && x.service.car_type === this.props.selectedCarTypeID) && x.service.service_type === i.service_type)
																								// != -1 
																								?
																								this.state.storeServicesList.filter(
																									j => j.service.id === i.id
																								).length > 0
																								// true
																								: false
																							: false

																						// standardExteriorcheckbox
																					}
																					onChange={(e) => {
																						let is_enabled = e.target.checked
																						this.updateService(i.id, is_enabled)
																					}}
																				/>
																				<label htmlFor={i.id}>{i.title}</label>
																			</div>
																		)
																	})
																	: null
															}
														</div>
													</div>
													<div className="service-nature-container">
														<div className="service-nature-header">
															{t('Premium')}
														</div>
														<div className="service-nature-list">
															{
																(this.state.premiumExteriorServicesList.length > 0) ?
																	this.state.premiumExteriorServicesList.map((i, index) => {
																		return (
																			<div className="service-item" key={index}>
																				<input
																					type="checkbox"
																					id={i.id}
																					checked={
																						this.state.storeServicesList.length > 0 ?
																							this.state.storeServicesList.find(x => (x.service.id === i.id && x.service.car_type === this.props.selectedCarTypeID) && x.service.service_type === i.service_type)
																								//  != -1 
																								?
																								// true
																								this.state.storeServicesList.filter(
																									j => j.service.id === i.id
																								).length > 0
																								: false
																							: false
																					}
																					onChange={(e) => {
																						let is_enabled = e.target.checked
																						this.updateService(i.id, is_enabled)
																					}}
																				/>
																				<label htmlFor={i.id}>{i.title}</label>
																			</div>
																		)
																	})
																	: null
															}
														</div>
													</div>
												</div>
										}[this.state.serviceType]
									}
								</div>
								<div className="modal-footer">
									<button className="btn-white" style={{ width: "7rem" }} onClick={() => this.hideModal()}>
										{t('Cancel')}
									</button>
									<button
										className="btn-navy"
										style={{ width: "7rem" }}
										onClick={this.save}
									>
										{t('Save')}
									</button>
								</div>
							</div>
						</div>
					</div>
			}
			</Translation>
		)
	}
}
export default CarTypeServicesModal