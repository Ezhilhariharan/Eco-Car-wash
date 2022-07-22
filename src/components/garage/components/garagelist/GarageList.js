import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { withTranslation } from 'react-i18next';
import { getGarageList } from '../../api/GET'
import CreateGarage from '../modals/CreateGarage';

import './styles/GarageList.scss'
import { logDOM } from '@testing-library/react';

class GarageList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			garages: [],
			page: 1,
			lock: true,
			addGarage: false,
		}
		this.setGarageList = this.setGarageList.bind(this);
		this.loadGarageUser = this.loadGarageUser.bind(this);
		this.createChild = React.createRef();
		this.openCreateGarage = this.openCreateGarage.bind(this);
		this.scrollLoader = this.scrollLoader.bind(this);
	}

	componentDidMount() {
		this.setGarageList();
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
				if (!this.state.lock && this.state.garages.next) {
					this.setState({ lock: true }, () => {
						this.setState({ page: this.state.page + 1 }, () => {
							this.setGarageList();
						});
					});
				}
			}
		});
	}
	setGarageList(reset = false) {
		getGarageList(this.state.page).then(res => {
			// console.log(res.data.Data);
			// this.setState({
			// 	garages: res.data.Data
			// })
			if (Object.keys(this.state.garages).length != 0 && !reset) {
				let list = this.state.garages.results;
				list.push(...res.data.Data.results);
				res.data.Data.results = list;
				// console.log(res.data.Data);
				this.setState({ garages: res.data.Data });
			} else {
				this.setState({ garages: res.data.Data });
			}
			this.setState({ lock: false });
		})
	}

	actionTemplate(rowData) {
		return (
			<React.Fragment>
				<div className="d-flex flex-row align-items-center justify-content-center">
					<i
						style={{ fontSize: "15px" }}
						className="fas fa-pen me-3"
					// onClick={() => this.editLeaveData(rowData.id)}
					></i>
					<i
						style={{ fontSize: "15px" }}
						className="fas fa-trash"
					// onClick={() => this.deleteLeaveData(rowData.id)}
					></i>
				</div>
			</React.Fragment>
		);
	}

	loadGarageUser(rowData) {
		// console.log(rowData);
		this.props.history.push(`/garage/${rowData.data.username}`)
	}

	openCreateGarage() {
		//addGarage
		this.setState({ addGarage: true }, () => this.createChild.current.showModal())
	}
	closeModal = () => {
		this.setState({ addGarage: false })
	}
	render() {
		// console.log("this.state.garages.results", this.state.garages.results, this.state.garages);
		const { t } = this.props
		return (
			<div className='garage-list-layout'>
				{/* {
					this.state.garages.length === 0 ? */}
				{/* <div className='garage-empty'>
					<button className="btn-navy" onClick={() => this.openCreateGarage()}>Create Garage</button>
				</div> */}
				{/* : */}
				<div className="garage-list">
					<div className="garage-list-header">
						<div className="title">{t('Garage list')}</div>
						<button className="btn-white" onClick={() => this.openCreateGarage()}>{t('Add')} +</button>
					</div>
					<div className='garage-table'>
						<DataTable value={this.state.garages.results} scrollable emptyMessage={t('No Record Found')} scrollHeight="100%" onRowClick={this.loadGarageUser}>
							<Column field="name" header={t('Name')}></Column>
							<Column field="address.address" header={t('Address')} ></Column>
							<Column field="email" header={t('Email')}></Column>
							<Column field="mobile_no" header={t('Phone')}></Column>
							<Column field="totalapps" header={t('No of Bookings')}></Column>
						</DataTable>
					</div>
				</div>
				{/* } */}
				{this.state.addGarage ? <CreateGarage ref={this.createChild} setGarageList={this.setGarageList} closeModal={this.closeModal} /> : null}
			</div>
		)
	}
}
export default withTranslation()(withRouter(GarageList))