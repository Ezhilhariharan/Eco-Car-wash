import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { withTranslation } from 'react-i18next';
import { getGarageAppointmentServicesList, getGarageAppointmentData } from '../../api/GET'
import EditGarageServices from './modals/EditGarageServices'

import './styles/GarageAppoinment.scss'

let url, appointment_id;
const months = [
	{ number: "0", month: "Select date" },
	{ number: "1", month: "January" },
	{ number: "2", month: "February" }
	, { number: "3", month: "March" }
	, { number: "4", month: "April" }
	, { number: "5", month: "May" }
	, { number: "6", month: "June" }
	, { number: "7", month: "July" }
	, { number: "8", month: "August" }
	, { number: "9", month: "September" }
	, { number: "10", month: "October" }
	, { number: "11", month: "November" }
	, { number: "12", month: "December" },
]
class GarageAppointment extends Component {
	constructor(props) {
		super(props)
		url = this.props.match.url
		appointment_id = this.props.match.params.id
		this.state = {
			appointmentDetails: {},
			appointmentServices: {},
			editedNumber: '',
			editedTime: '',
			filterDate: [],
			page: 1,
			lock: true,
			cleanerBox: "",
			cleanerSelect: false,
		}
		this.getAppointmentDetails = this.getAppointmentDetails.bind(this)
		this.getAppointmentServices = this.getAppointmentServices.bind(this)
		this.editServiceCollection = this.editServiceCollection.bind(this)
		this.actionTemplate = this.actionTemplate.bind(this)
		this.editServiceChild = React.createRef()
		this.scrollLoader = this.scrollLoader.bind(this);
	}

	componentDidMount() {
		this.getAppointmentDetails(appointment_id)
		this.getAppointmentServices(appointment_id)
		this.scrollLoader();
	}
	scrollLoader() {
		let scroller = document.getElementsByClassName(
			"p-datatable-scrollable-body"
		)[0];
		let scrollerBody = document.getElementsByClassName(
			"p-datatable-scrollable-body-table"
		)[0];
		scroller.addEventListener("scroll", () => {
			if (
				scroller.scrollTop >
				(scrollerBody.clientHeight - scroller.clientHeight) * 0.9
			) {
				if (!this.state.lock && this.state.appointmentServices.next) {
					this.setState({ lock: true }, () => {
						this.setState({ page: this.state.page + 1 }, () => {
							this.getAppointmentServices(appointment_id);
						});
					});
				}
			}
		});
	}

	getAppointmentDetails(id) {
		getGarageAppointmentData(id).then(res => {
			console.log("getAppointmentDetails", res.data.Data);
			if (res.data.Status) {
				this.setState({ appointmentDetails: res.data.Data })
				if (res.data.Data.appointment_duration && res.data.Data.date) {
					let resdate = res.data.Data.date.split("T")[0]
					let Startdate = new Date(resdate);
					let Enddate = new Date(resdate);
					Enddate.setDate(Enddate.getDate() + res.data.Data.appointment_duration);
					console.log("getAppointmentDetails", Startdate, Enddate);
					let Range_Date = [{ dates: "select Dates", value: "" }];
					// let dates
					while (Startdate < Enddate) {
						console.log(Startdate.getDate()); // ISO Date format
						Range_Date.push({ dates: Startdate.getDate(), value: `${Startdate.getFullYear()}-${(Startdate.getMonth() + 1).toString().padStart(2, '0')}-${Startdate.getDate()}` })
						var newDate = Startdate.setDate(Startdate.getDate() + 1);
						Startdate = new Date(newDate);
					}
					// console.log("Range_Date", Range_Date);
					// this.setState({ filterDate: Range_Date })
				}
			}

		}).catch(err => {
			console.log(err);
		})
	}

	getAppointmentServices(id, username, date, reset = false) {
		let list
		getGarageAppointmentServicesList(id, username, date).then(res => {
			console.log("cool", res.data.Data);
			// this.setState({
			// 	appointmentServices: res.data.Data,
			// 	editedNumber: '',
			// 	editedTime: ''
			// })
			if (Object.keys(this.state.appointmentServices).length != 0 && !reset) {
				list = this.state.appointmentServices.results;
				list.push(...res.data.Data.results);
				res.data.Data.results = list;
				let Range_Date = [{ dates: "select Dates", value: "" }];
				res.data.Data.results.map((item) => {
					let resdate = item.start_time.split("T")[0]
					Range_Date.push({ dates: new Date(resdate).getDate(), value: resdate })
				})
				console.log("Range_Date", Range_Date);
				this.setState({ appointmentServices: res.data.Data, editedNumber: '', editedTime: '', filterDate: Range_Date });
			} else {
				let Range_Date = [{ dates: "select Dates", value: "" }];
				res.data.Data.results.map((item) => {
					let resdate = item.start_time.split("T")[0]
					Range_Date.push({ dates: new Date(resdate).getDate(), value: resdate })
				})
				console.log("Range_Date", Range_Date);
				this.setState({ appointmentServices: res.data.Data, editedNumber: '', editedTime: '', filterDate: Range_Date });
			}
			this.setState({ lock: false });
		}).catch(err => {
			console.log(err);
		})
	}

	editServiceCollection(number) {
		this.setState({ editedNumber: number }, () => this.editServiceChild.current.showModal())
	}

	// componentDidUpdate(prevProps, prevState) {
	// 	if (this.state.editedNumber !== "" && this.state.editedTime !== "") {
	// 		this.editServiceChild.current.showModal()
	// 	}
	// }

	actionTemplate(rowData) {
		// console.log("actionTemplate", rowData);
		return (
			<React.Fragment>
				<div className="d-flex flex-row align-items-center justify-content-center">
					{
						this.state.appointmentDetails?.appointment_status !== "Completed" ?
							<i
								style={{ fontSize: "15px" }}
								className="fas fa-pen me-3"
								onClick={() => this.editServiceCollection(rowData.id)}
							></i>
							:
							<i
								style={{ fontSize: "15px" }}
								className="fas fa-eye me-3"
								onClick={() => this.editServiceCollection(rowData.id)}
							></i>
					}

				</div>
			</React.Fragment>
		);
	}
	cleanersOrderList = (id) => {
		if (!this.state.cleanerSelect || (this.state.cleanerBox !== id || "")) {
			this.setState({ appointmentServices: {}, cleanerBox: id, cleanerSelect: true }, () => this.getAppointmentServices(appointment_id, id));
		} else {
			this.setState({ appointmentServices: {}, cleanerBox: id, cleanerSelect: !this.state.cleanerSelect }, () => this.getAppointmentServices(appointment_id));
		}
	}
	refreshState = () => {
		this.setState({ appointmentServices: {} })
	}
	render() {
		// console.log(this.state.appointmentServices);
		const { t } = this.props
		return (
			<div className='garage-appointment-details-layout'>
				<div className="garage-appointment-details">
					<button
						className="btn-navy-circle"
						onClick={() => this.props.history.goBack()}
					>
						<i className="fas fa-chevron-left"></i>
					</button>
					<div className="garage-appointment-details-header">
						<span className="title">{t('Summary')}</span>
					</div>
					<div className="garage-appointment-details-body">
						<div className="profile">
							<img src={this.state.appointmentDetails?.user?.profile_image ? this.state.appointmentDetails?.user?.profile_image : "https://picsum.photos/200"} alt="" />
						</div>

						<div className="name">{this.state.appointmentDetails?.user?.name}</div>

						<div className="user-data">
							<div className="title">
								{t('Phone')}
							</div>
							<div className="data">
								{this.state.appointmentDetails?.user?.mobile_no}
							</div>
						</div>

						<div className="user-data">
							<div className="title">
								{t('Email')}
							</div>
							<div className="data">
								{this.state.appointmentDetails?.user?.email}
							</div>
						</div>

						<div className="user-data">
							<div className="title">
								{t('Address')}
							</div>
							<div className="data">
								{this.state.appointmentDetails?.address?.address}
							</div>
						</div>
					</div>
					<div className="garage-appointment-details-cleaner">
						{
							(
								Object.keys(this.state.appointmentDetails).length > 0 &&
								this.state.appointmentDetails.hasOwnProperty('cleaners') &&
								this.state.appointmentDetails.cleaners.length > 0
							) ?
								this.state.appointmentDetails?.cleaners.map((cleaner, index) => {
									// console.log("appointmentDetails", this.state.appointmentDetails?.cleaners);
									return (
										<div className={this.state.cleanerBox === cleaner.username && this.state.cleanerSelect ? "cleaner-card cleaners_active" : "cleaner-card "} key={index} onClick={() => this.cleanersOrderList(cleaner.username)}>
											<div className="profile">
												<img src={this.state.profile_image ? this.state.profile_image : "https://picsum.photos/100"} alt="" />
											</div>
											<div className="data">
												<div className="title">{t('Name')}</div>
												<div className="name">{cleaner.name}</div>
											</div>
										</div>
									)
								})
								:
								<div>
									{t('No cleaners')}
								</div>
						}
					</div>
				</div>
				<div className="garage-appointment-list-outer">
					<div className="garage-appointment-list-outer-header">
						<span className='fw-3 fs-3'>{t('Booking Type')}</span>
						<span className="ms-5 fs-4">{t(`${this.state.appointmentDetails?.appointment_type}`)}</span>
						{
							this.state.appointmentDetails?.appointment_type == "Day" ?
								<select
									className="select-dates ms-4"
									onChange={(e) => {
										console.log("monthly", e.target.value)
										this.setState({ appointmentServices: {} }, () => this.getAppointmentServices(appointment_id, "", e.target.value))

									}}
								>
									{this.state.filterDate.map((option, index) => (
										<option value={option.value} key={index}>{option.dates}</option>
									))}
								</select> : null
						}
					</div>
					<div className="garage-appointment-list">
						<DataTable value={this.state.appointmentServices.results} scrollable scrollHeight="100%">
							<Column field="car_number" header={t('Car Number')}></Column>
							<Column field="car_type" header={t('Car Type')}></Column>
							<Column field="start_time" header={t('Start Time')}></Column>
							<Column field="end_time" header={t('End Time')}></Column>
							<Column field="no_of_services" header={t('No of Services')}></Column>
							<Column field="id" header={t('Action')} body={this.actionTemplate}></Column>
						</DataTable>
					</div>
				</div>
				{
					this.state.editedNumber !== "" ?
						<EditGarageServices
							ref={this.editServiceChild}
							// appointment_id={appointment_id}
							editedNumber={this.state.editedNumber}
							// editedTime={this.state.editedTime}
							// appointmentData={this.state.appointmentDetails}
							refresh={this.getAppointmentServices}
							refreshState={this.refreshState}
							id={appointment_id}
						// getAppointmentServices={this.getAppointmentServices}
						/>
						: null
				}
			</div>
		)
	}
}
export default withTranslation()(withRouter(GarageAppointment))