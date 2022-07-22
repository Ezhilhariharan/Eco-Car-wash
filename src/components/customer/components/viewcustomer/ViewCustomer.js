import React, { Component } from "react";
import { withRouter, NavLink } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import LinesEllipsis from "react-lines-ellipsis";
import ScaleText from "react-scale-text";
import UserReview from "../../../common/userReviews/UserReview";
import UserReviewModal from "../../../common/userReviews/UserReviewModal";
import axios from "axios";
import { Modal } from "bootstrap";
import { withTranslation } from 'react-i18next';

import { getCustomerData, getCustomerRating } from "../../api/GET";
import { patchCustomer } from "./api/PATCH";

import "./styles/ViewCustomer.scss";

let url, id;
class ViewCustomer extends Component {
	constructor(props) {
		super(props);
		url = this.props.match.path;
		id = this.props.match.params.id;
		console.log("id", id);
		this.state = {
			customer: {},
			customerReview: {},
			address: "",
			invoice_data: [],
			viewInvoice: "",
		};
		this.modalRef = React.createRef();
		this.ViewmodalRef = React.createRef();
		this.getCustomerDetails = this.getCustomerDetails.bind(this);
		this.showViewModal = this.showViewModal.bind(this);
		this.hideModal = this.hideModal.bind(this);
	}

	componentDidMount() {
		this.getCustomerDetails();
		this.invoiceDetails();
	}
	showViewModal = () => {
		console.log("cool");
		const modalEle = this.ViewmodalRef.current;
		const bsModal = new Modal(modalEle, {
			backdrop: "static",
			keyboard: false,
		});
		bsModal.show();
	}
	hideModal() {
		const modalEle = this.ViewmodalRef.current;
		const bsModal = Modal.getInstance(modalEle);
		bsModal.hide();
	}
	invoiceDetails = () => {
		axios
			.get(`/api/manage_appointments/get_all_invoice/?customer=${id}`)
			.then((res) => {
				console.log("invoiceDetails", res);
				this.setState({ invoice_data: res.data.Data });
			})
			.catch((err) => {
				console.log(err);
			});
	}
	StarComponent(rating) {
		let html = [];
		for (let i = 1; i <= 5; i++) {
			i <= rating
				? html.push(
					<span className="fa-solid fa-star-sharp checked"></span>
				)
				: html.push(<span className="fa-solid fa-star-sharp"></span>);
		}
		return html;
	}

	updateRatingStatus(i) {
		let list = this.state.customerReview;
		list.results[i].is_approved = !list.results[i].is_approved;
		patchCustomer(list.results[i].id, { is_approved: list.results[i].is_approved })
			.then((res) => {
				console.log(res.data);
				this.setState({ customerReview: list });
			})
			.catch((err) => console.log(err));
	}

	customerReviewSection() {
		if (Object.keys(this.state.customerReview).length > 0 && this.state.customerReview.results.length > 0) {
			return this.state.customerReview.results.map((data, index) => {
				let i = this.state.customerReview.results.indexOf(data);
				console.log("customerReviewSection", data)
				const { t } = this.props
				return (
					<React.Fragment>
						<div className="d-flex flex-column customer-reviews-element w-100">
							<div
								style={{ height: "40%" }}
								className="d-flex flex-row align-items-center w-100 justify-content-between "
							>
								<div className="d-flex flex-column customer-profile-picture me-3">
									<img src={data.user.profile_image ? data.user.profile_image : "https://picsum.photos/100"} alt={data.user.name} />
								</div>
								<div className="d-flex flex-column">
									<p className="d-flex flex-row mb-2 mt-0">
										{/* {data.user.name} */}
										cool
									</p>
									<div className="d-flex flex-row">
										{this.StarComponent(data.rating)}
									</div>
								</div>

								<div className="d-flex flex-column my-auto ms-auto">
									<select
										name={`rating_${data.id}`}
										id={`rating_${data.id}`}
										className="form-select drop-down"
										value={this.state.customerReview.results[i].is_approved}
										onChange={() => this.updateRatingStatus(i)}
									>
										<option value="true">{t('Approved')}</option>
										<option value="false">{t('Disapproved')}</option>
									</select>
								</div>
							</div>
							<div
								style={{ height: "60%" }}
								className="review-content d-flex flex-row pt-4"
							>
								<LinesEllipsis
									text={data.review}
									maxLine="2"
									ellipsis="..."
									trimRight
									basedOn="letters"
									onReflow={this.handleReflow}
								/>
							</div>
						</div>

						{index < this.state.customerReview.length - 1 ? (
							<div
								id="#bottomLine"
								style={{ borderBottom: "1px solid #b4b4b4" }}
							></div>
						) : null}
					</React.Fragment>
				);
			});
		}
	}

	getCustomerDetails() {
		getCustomerData(id).then((res) => {
			console.log("customer", res);
			this.setState({
				customer: res.data.Data,
			});
			let cust_address = res.data.Data.address
			if (typeof cust_address.address === "object") {
				cust_address = cust_address.address.address
			} else if (typeof cust_address.address === "string") {
				cust_address = cust_address.address
			}
			this.setState({ address: cust_address });
		}, err => console.log(err));

		getCustomerRating(id).then((res) => {
			console.log("customerReview", res.data.Data);
			this.setState({
				customerReview: res.data.Data,
			});
		}, err => {
			console.log(err);
		});
	}
	downloadInvoice = (rowData) => {
		const a = document.createElement('a');
		a.style.display = 'none';
		a.href = rowData.invoice_file;
		a.download = rowData.invoice_number + '.pdf';
		document.body.appendChild(a);
		a.click();
		window.URL.revokeObjectURL(rowData);
	}
	actionTemplate = (rowData) => {
		return (
			<React.Fragment>
				<i class="fa-solid fa-eye" onClick={() => this.setState({ viewInvoice: rowData.invoice_file }, () => this.showViewModal())}></i>
				<i class="fa-solid fa-download ms-3" onClick={() => this.downloadInvoice(rowData)}></i>
			</React.Fragment>
		);
	}
	render() {
		const { t } = this.props
		return (
			<div className="viewcustomer-layout">
				<div className="customer-details">
					<div className="customer_details_card">
						<div className="start-back">
							<div className="buttons">
								<button
									className="btn-navy-circle"
									onClick={() => this.props.history.goBack()}
									style={{
										width: "30px",
										height: "30px",
									}}
								>
									<i className="fas fa-chevron-left"></i>
								</button>
							</div>
						</div>
						<div className="start-content  ">
							<div className="image">
								<img src={this.state.customer?.profile_image ? this.state.customer?.profile_image :
									`https://avatars.dicebear.com/api/initials/${this.state.customer?.name}.svg`} />
							</div>
							<h5 className="mb-3">
								{this.state.customer?.name}
							</h5>
						</div>
						<div className="middle_address">
							<div className="phone">
								<h6>{t('Phone')}</h6>
								<p style={{ color: "gray" }}>
									{this.state.customer?.mobile_no}
								</p>
							</div>
							<div className="email">
								<h6>{t('E-mail')}</h6>
								<p style={{ color: "gray" }}>
									{this.state.customer?.email}
								</p>
							</div>
							<div className="address">
								<h6>{t('address')}</h6>
								<div className="inside_scroll_address">
									<h6
										style={{
											color: "gray",
										}}
									>
										{
											this.state.address === "" ? t('No Address') : this.state.address
										}
									</h6>
								</div>
							</div>
						</div>
						<div className="end-list_address">
							<div className="card">
								<div className="card-body d-flex flex-column">
									<h4 className="pb-4">{t('Car Type')}</h4>
									<div className="d-flex flex-row">
										<div className="col-4">
											<h6 className="mint">{t('Make')}</h6>
											<p>
												{
													this.state.customer
														?.user_cars?.car_make
												}
											</p>
										</div>
										<div className="col-4">
											<h6 className="mint">{t('Model')}</h6>
											<p>
												{
													this.state.customer
														?.user_cars?.car_model
												}
											</p>
										</div>
										<div className="col-4">
											<h6 className="mint">{t('Type')}</h6>
											<p>
												{
													this.state.customer
														?.user_cars?.car_type
												}
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="customer-extra-details">
						<NavLink
							to={`/orderdetails?status=All&customer=${id}`}
							style={{ textDecoration: "none" }}
							className="card customer-appointments"
						>

							<div className="card-body d-flex flex-column align-items-center">
								<div className="d-flex flex-row justify-content-center cards_back w-100">
									<h5>{t('Completed Appointments')}</h5>
								</div>
								<div className="h-75 w-100 text-center d-flex align-items-center justify-content-center">
									<ScaleText widthOnly={true} maxFontSize={80} className="d-flex align-items-center justify-content-center">
										<p className="my-auto mint">
											{this.state.customer?.totalapps}
										</p>
									</ScaleText>
								</div>
							</div>
						</NavLink>

						<div className="customer-ratings">
							<div className="card">
								<div className="card-body">
									<div className="d-flex flex-row justify-content-between cards_back">
										<h5
											style={{ height: "7%" }}
											className="d-flex justify-content-left"
										>
											{t('User Reviews')}
										</h5>
										<div
											style={{
												color: "gray",
												textDecoration: "none",
												cursor: "pointer"
											}}
											className="d-flex justify-content-right"
											// data-bs-toggle="modal"
											// data-bs-target="#staticBackdrop"
											onClick={() => this.modalRef.current.showModal()}
										>
											{t('View more')}
										</div>
										<div
											className="modal fade"
											id="staticBackdrop"
											data-bs-backdrop="static"
											data-bs-keyboard="false"
											tabIndex="-1"
											aria-labelledby="staticBackdropLabel"
											aria-hidden="true"
										>
											<div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
												<div className="modal-content">
													<div className="modal-header">
														<h5
															className="modal-title"
															id="staticBackdropLabel"
														>
															{t('User Reviews')}
														</h5>
														<a data-bs-dismiss="modal">
															{t('View more')}
														</a>
													</div>
													<div className="modal-body modal-lg px-4">
														{this.customerReviewSection()}
													</div>
												</div>
											</div>
										</div>
									</div>
									<div className="customer-reviews-block">
										{Object.keys(this.state.customerReview).length >
											0 ? (
											// this.customerReviewSection()
											// showApprove={this.props.showApprove}
											<UserReview id={id}
												showApprove="false" />
										) : (
											<div className="h-100 w-100 d-flex align-items-center justify-content-center">
												<h5>{t('No Reviews')}</h5>
											</div>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="invoice-details">
					<div className="invoice-header">
						<h4>{t('Invoice')}</h4>
						{/* <button className="btn-navy">
							Add <i className="ms-2 fa-regular fa-plus"></i>
						</button> */}
					</div>
					<div className="invoice-list">
						<DataTable
							value={this.state.invoice_data}
							scrollable
							scrollHeight="100%"
							emptyMessage={t('No Record Found')}
						>
							<Column field="invoice_number" header={t('No')}></Column>
							<Column field="invoice_date" header={t('Date')}></Column>
							<Column field="store_name" header={t('Store name')}></Column>
							{/* <Column field="name" header="Name"></Column> */}
							<Column field="invoice_amount" header={t('Amount')}></Column>
							<Column field="Action" header={t('Action')} body={this.actionTemplate}></Column>
						</DataTable>
					</div>
				</div>
				<UserReviewModal ref={this.modalRef} id={id} showApprove="true" />
				<div className="invoiceModal">
					<div className="modal" ref={this.ViewmodalRef} tabIndex="-1">
						<div className="modal-dialog modal-md">
							<div className="modal-content">
								<div className="modal-header">
									<h5 className="modal-title"></h5>
									<button
										type="button"
										className="btn-close"
										onClick={() => this.hideModal()}
										aria-label="Close"
									></button>
								</div>
								<div className="modal-body">
									<iframe src={this.state.viewInvoice} style={{ width: "100%", height: "100%" }} ></iframe>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
export default withTranslation()(withRouter(ViewCustomer));
