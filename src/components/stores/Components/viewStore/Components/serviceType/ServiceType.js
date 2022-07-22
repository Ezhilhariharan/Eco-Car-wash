import React, { Component } from 'react'
import CarTypeServicesModal from './modals/CarTypeServicesModal';
import { getCarTypes, getCarTypeSelection } from "./api/GET";
import { patchStoreServiceMapping } from './api/PATCH';
import { withTranslation } from 'react-i18next';

import "./style/ServiceType.scss";

class ServiceType extends Component {
	constructor(props) {
		super(props);
		this.state = {
			carTypeList: [],
			selectedCarTypeID: "",
			storeServicesList: [],
			modal: false,
		}
		this.getCarTypesList = this.getCarTypesList.bind(this);
		this.getStoreServices = this.getStoreServices.bind(this);
		this.saveServiceMapping = this.saveServiceMapping.bind(this);
		this.cartypeModal = React.createRef();
	}
	componentDidMount() {
		this.getCarTypesList();
		this.getStoreServices();
	}

	getCarTypesList() {
		getCarTypes().then(
			res => {
				if (res.data.Status) {
					this.setState({
						carTypeList: res.data.Data.filter((item) => item.status == "active")
					})
				} else {
					console.error(res)
				}
			},
			err => console.log(err)
		);
	}

	getStoreServices() {
		getCarTypeSelection(this.props.store_id).then(
			res => {
				console.log("storeServicesList", res.data.Data);
				if (res.data.Status) {
					this.setState({ storeServicesList: res.data.Data })
				} else {
					console.error(res)
				}
			},
			err => console.log(err)
		)
	}

	saveServiceMapping() {
		// e.target.setAttribute("disabled", true);
		let services = [];
		for (let i of this.state.storeServicesList) {
			if (i.is_enabled) {
				services.push(i.service.id);
			}
		}
		console.log("services", services);
		patchStoreServiceMapping({
			store: this.props.store_id,
			services: services
		}).then(
			res => {
				if (res.data.Status) {
					this.cartypeModal.current.hideModal()
					this.props.changeMenu(1)
				} else {
					console.error(res)
				}
			},
			err => console.log(err)
		)
	}
	setStoreServicesListfunc = (List) => {
		// console.log("ok_storeServicesList", List);
		this.setState({ storeServicesList: List }, () => this.saveServiceMapping())
	}
	closeModal = () => {
		// console.log('cool');
		this.setState({ modal: false })
	}
	render() {
		console.log("cool", this.state.selectedCarTypeID, this.state.storeServicesList.length > 0, this.state.modal);
		const { t } = this.props
		return (
			<div className='service-mapping-section'>
				<div className="cartype-selection-card">
					<div className="cartype-card-header">
						<button className="btn-navy-circle" onClick={() => this.props.changeMenu(1)}>
							<i className="fa fa-chevron-left"></i>
						</button>
						<h4>{t('Car Types')}</h4>
					</div>
					<div className="cartype-card-body">
						<div className="cartype-list">
							{
								(this.state.carTypeList.length > 0) ?
									this.state.carTypeList.map((carType, index) => {
										// console.log("cool_2", carType.id);
										return (
											<div className="cartype-item" key={index}>
												<span>{carType.name}</span>
												<button
													className="btn-navy-circle"
													onClick={() => {
														this.setState({ selectedCarTypeID: carType.id, modal: true }, () => {
															this.cartypeModal.current.showModal()
														})
													}}
												>
													<i className="fa fa-chevron-right"></i>
												</button>
											</div>
										)
									})
									: null
							}
						</div>
					</div>
				</div>
				<div className="service-listing-card">
					<div className="service-card-header">
						<h4>{t('Services')}</h4>
						{/* <button className="btn-navy" onClick={(e)=>this.saveServiceMapping(e)}>save</button> */}
					</div>
					<div className="service-card-body">
						{
							(this.state.carTypeList.length > 0) ?
								this.state.carTypeList.map((carType, index) => {
									return (
										<div className="cartype-section" key={carType.id}>
											<div className="cartype-name">
												{carType.name}
											</div>
											<div className="service-section">
												<div className="service-name">
													{t('Standard - Interior')}
												</div>
												<div className="service-list">
													{
														(this.state.storeServicesList.length > 0) ?
															this.state.storeServicesList.filter(
																i => i.service.car_type === carType.id
															).filter(
																i => i.service.service_type === "Interior"
															).filter(
																i => i.service.service_nature === "Standard"
															).map((i, index) => {
																if (i.is_enabled) {
																	return (
																		<span
																			className="service-item"
																			key={index}
																		>{i.service.title}</span>
																	)
																}
															})
															: null
													}
												</div>
												<div className="service-name">
													{t('Premium - Interior')}
												</div>
												<div className="service-list">
													{
														(this.state.storeServicesList.length > 0) ?
															this.state.storeServicesList.filter(
																i => i.service.car_type === carType.id
															).filter(
																i => i.service.service_type === "Interior"
															).filter(
																i => i.service.service_nature === "Premium"
															).map((i, index) => {
																if (i.is_enabled) {
																	return (
																		<span
																			className="service-item"
																			key={index}
																		>{i.service.title}</span>
																	)
																}
															})
															: null
													}
												</div>
												<div className="service-name">
													{t('Standard - Exterior')}
												</div>
												<div className="service-list">
													{
														(this.state.storeServicesList.length > 0) ?
															this.state.storeServicesList.filter(
																i => i.service.car_type === carType.id
															).filter(
																i => i.service.service_type === "Exterior"
															).filter(
																i => i.service.service_nature === "Standard"
															).map((i, index) => {
																if (i.is_enabled) {
																	return (
																		<span
																			className="service-item"
																			key={index}
																		>{i.service.title}</span>
																	)
																}
															})
															: null
													}
												</div>
												<div className="service-name">
													{t('Premium - Exterior')}
												</div>
												<div className="service-list">
													{
														(this.state.storeServicesList.length > 0) ?
															this.state.storeServicesList.filter(
																i => i.service.car_type === carType.id
															).filter(
																i => i.service.service_type === "Exterior"
															).filter(
																i => i.service.service_nature === "Premium"
															).map((i, index) => {
																if (i.is_enabled) {
																	return (
																		<span
																			className="service-item"
																			key={index}
																		>{i.service.title}</span>
																	)
																}
															})
															: null
													}
												</div>
											</div>
										</div>
									)
								})
								: null
						}
					</div>
				</div>
				{
					this.state.selectedCarTypeID !== "" && this.state.modal ?
						<CarTypeServicesModal
							ref={this.cartypeModal}
							storeID={this.props.store_id}
							selectedCarTypeID={this.state.selectedCarTypeID}
							selectedCarTypeName={this.state.carTypeList.filter(carType => carType.id === this.state.selectedCarTypeID)[0].name}
							resetSelectedCarType={() => this.setState({ selectedCarTypeID: "" })}
							storeServicesList={this.state.storeServicesList}
							setStoreServicesList={this.setStoreServicesListfunc}
							closeModal={this.closeModal}
						/>
						: null
				}
			</div>
		)
	}
}

export default withTranslation()(ServiceType)