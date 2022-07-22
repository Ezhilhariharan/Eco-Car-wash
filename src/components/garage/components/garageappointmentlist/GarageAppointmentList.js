import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import axios from "axios";
import { withTranslation } from 'react-i18next';
import { getCompletedGarageAppointmentList } from '../../api/GET'

import './styles/GarageAppointmentList.scss'

let url, id;
class GarageAppointmentList extends Component {
	constructor(props) {
		super(props)
		url = this.props.match.url
		id = this.props.match.params.id
		this.state = {
			appointments: [],
			page: 1,
			lock: true,
		}
		this.getCompletedGarageAppointmentData = this.getCompletedGarageAppointmentData.bind(this)
		this.actionTemplate = this.actionTemplate.bind(this);
		this.paymentTemplate = this.paymentTemplate.bind(this);
		this.scrollLoader = this.scrollLoader.bind(this);
	}

	componentDidMount() {
		this.getCompletedGarageAppointmentData(id);
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
				if (!this.state.lock && this.state.appointments.next) {
					this.setState({ lock: true }, () => {
						this.setState({ page: this.state.page + 1 }, () => {
							this.getCompletedGarageAppointmentData(id);
						});
					});
				}
			}
		});
	}

	getCompletedGarageAppointmentData(user_id, reset = false) {
		getCompletedGarageAppointmentList(user_id, this.state.page).then(res => {
			if (Object.keys(this.state.appointments).length != 0 && !reset) {
				let list = this.state.appointments.results;
				list.push(...res.data.Data.results);
				res.data.Data.results = list;
				this.setState({ appointments: res.data.Data });
			} else {
				this.setState({ appointments: res.data.Data });
			}
			this.setState({ lock: false });
		}).catch(err => {
			console.log(err);
		})
	}
	paymentFunc = (user_id) => {
		let formData = new FormData();
		formData.append("payment_status", "Paid");
		axios
			.patch(`/admin/manage_garage_appointments/${user_id}/`, formData)
			.then((res) => {
				console.log(res);
				if (res.data.Status) {
					this.getCompletedGarageAppointmentData(id, true)
				} else {
					console.error(res)
				}
			})
			.catch((err) => {
				console.log(err);
			});
	}
	paymentTemplate(rowData) {
		// console.log(rowData.id);
		return (
			<React.Fragment>
				{
					{
						"Unpaid":
							<button
								className="btn-navy"
								style={{ width: "9rem" }}
								onClick={() => this.paymentFunc(rowData.id)}
							>
								Payment Done
							</button>,
						"Paid":
							<div>Paid</div>
					}[rowData.payment_status]
				}
			</React.Fragment>
		)
	}

	actionTemplate(rowData) {
		console.log(rowData);
		return (
			<React.Fragment>
				<div className="d-flex flex-row align-items-center justify-content-center">
					<button
						className="btn-navy-circle"
						onClick={() => this.props.history.push(`/garage/appointment/${rowData.id}`)}
						style={{ width: "30px", height: "30px" }}
					>
						<i className="fa fa-chevron-right"></i>
					</button>
				</div>
			</React.Fragment>
		);
	}

	render() {
		const { t } = this.props
		return (
			<div className="completed-appointment-list-layout">
				<div className="completed-appointment-list-layout-header">
					<button className="btn-navy-circle" onClick={() => this.props.history.goBack()}>
						<i className="fas fa-chevron-left"></i>
					</button>
					<div className="completed-appointment-list-layout-title ms-4">
						{t('Completed Orders')}
					</div>
				</div>
				<div className="completed-appointment-list">
					<DataTable value={this.state.appointments?.results} emptyMessage={t('No Record Found')} scrollable scrollHeight="100%">
						<Column field="store.name" header={t('Store Name')}></Column>
						<Column field="appointment_type" header={t('Type of Booking')}></Column>
						<Column field="date" header={t('Start Date')}></Column>
						<Column field="date" header={t('End Date')}></Column>
						<Column field="payment_status" header={t('Payment')} body={this.paymentTemplate}></Column>
						<Column field="id" header={t('Action')} body={this.actionTemplate}></Column>
					</DataTable>
				</div>
			</div>
		)
	}
}
export default withTranslation()(withRouter(GarageAppointmentList))