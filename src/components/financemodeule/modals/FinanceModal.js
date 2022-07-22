import React, { Component } from 'react'
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Modal } from 'bootstrap';
import { Translation } from 'react-i18next';
import "./styles/FinanceModal.scss";

class FinanceModal extends Component {

	constructor(props) {
		super(props);
		this.modalRef = React.createRef()
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

	render() {
		return (
			<Translation>{
				(t, { i18n }) =>
					<div
						className="modal"
						ref={this.modalRef}
						tabIndex="-1"
					>
						<div className="modal-dialog modal-lg">
							<div className="modal-content">
								<div className="modal-header">
									<h5 className="modal-title">Finance module</h5>
									<button
										type="button"
										className="btn-close"
										onClick={() => this.hideModal()}
										aria-label="Close"
									></button>
								</div>
								<div className="modal-body financecartype mx-5">
									<div className="financecartype-list">
										<DataTable
											value={this.props.financeData}
											scrollable
											scrollHeight="100%"
											emptyMessage={t('No Record Found')}
										>
											<Column field="car_type" header="Car Type"></Column>
											<Column field="std_count" header="Standard"></Column>
											<Column field="pre_count" header="Premium"></Column>
										</DataTable>
									</div>
								</div>
							</div>
						</div>
					</div>
			}
			</Translation>
		)
	}
}
export default FinanceModal;