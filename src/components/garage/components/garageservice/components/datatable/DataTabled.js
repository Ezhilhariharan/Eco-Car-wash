import React, { useState, useEffect } from 'react'
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useTranslation } from 'react-i18next';
import { updateService } from '../../api/PATCH'

import './styles/DataTabled.scss'

export default function DataTabled({
	serviceNature,
	serviceData,
	openModal,
	deleteServiceData,
	editServiceData
}) {
	const [services, setServices] = useState([])
	const { t, i18n } = useTranslation();
	useEffect(() => {
		setServices(serviceData)
	}, [serviceData])

	const changeStatus = (i) => {
		const newServices = [...services]
		// console.log(newServices);
		if (newServices[i].status === "active") {
			newServices[i].status = "inactive";
		} else if (services[i].status === "inactive") {
			newServices[i].status = "active";
		}
		updateService(newServices[i].id, { status: newServices[i].status }).then(
			res => {
				console.log(res);
				setServices(newServices)
			},
			err => console.log(err)
		)
	}

	const statusTemplate = (rowData) => {
		// console.log(rowData);
		let i = services.indexOf(rowData);
		// console.log(i);
		return (
			<React.Fragment>
				<div className="d-flex flex-row justify-content-center">
					<label className="customised-switch">
						<input
							type="checkbox"
							checked={rowData.status === "active" ? true : false}
							onChange={() => changeStatus(i)}
						/>
						<span className="customised-slider customised-round"></span>
					</label>
				</div>
			</React.Fragment>
		)
	}

	const actionTemplate = (rowData) => {
		return (
			<React.Fragment>
				<div className="d-flex flex-row align-items-center justify-content-center">
					<i
						style={{ fontSize: "15px" }}
						className="fas fa-pen me-3"
						onClick={() => editServiceData(rowData.id)}
					></i>
					<i
						style={{ fontSize: "15px" }}
						className="fas fa-trash"
						onClick={() => deleteServiceData(rowData.id, serviceNature)}
					></i>
				</div>
			</React.Fragment>
		);
	}
	return (
		<div className='service-datatable'>
			<div style={{ height: '10%' }} className='service-datatable-header'>
				<span className='service-title mx-auto'>{t(`${serviceNature}`)}</span>
				<button className='btn-white w-25 ms-auto'
					onClick={() => openModal(serviceNature)} >{t('Add')} +</button>
			</div>
			<DataTable value={serviceData} scrollable scrollHeight="100%" emptyMessage={t('No Record Found')} responsiveLayout="scroll" style={{ height: '90%' }}>
				<Column field="service.title" header={t('Title')}></Column>
				<Column field="price" header={t('Price')}></Column>
				<Column field="service.timetaken" header={t('Time Taken')}></Column>
				<Column field="id" header={t('Status')} body={statusTemplate}></Column>
				<Column field="id" header={t('Action')} body={actionTemplate}></Column>
			</DataTable>
		</div>
	)
}