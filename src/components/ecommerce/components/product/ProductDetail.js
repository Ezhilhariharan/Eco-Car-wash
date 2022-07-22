import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { withTranslation } from 'react-i18next';

import { getOrderDetails } from "../../api/GET";
import { deleteOrderData } from "../../api/DELETE";

import EditProduct from "../modals/EditProduct";
import EditOrder from "../modals/EditOrder";

import "./styles/ProductDetail.scss";

class ProductDetail extends Component {
	constructor(props) {
		super(props)
		this.state = {
			product: [],
			order_details: [],
			orderID: "",
			editProduct: false,
		}
		this.actionTemplate = this.actionTemplate.bind(this)
		this.updateProductData = this.updateProductData.bind(this)
		this.getAllOrderDetails = this.getAllOrderDetails.bind(this)
		this.editOrderData = this.editOrderData.bind(this)
		this.resetOrderID = this.resetOrderID.bind(this)
		this.editProduct = React.createRef()
		this.editOrder = React.createRef()
	}

	componentDidMount() {
		this.setState({ product: this.props.product });
		this.getAllOrderDetails();
	}

	// componentDidUpdate(prevProps, prevState) {
	// 	if (this.state.orderID !== "") {
	// 		this.editOrder.current.showModal();
	// 	}
	// }

	getAllOrderDetails() {
		this.setState({ orderID: "" });
		getOrderDetails(this.props.product[0].id).then((res) => {
			console.log("order list", res.data.Data);
			this.setState({ order_details: res.data.Data });
		});
	}

	editOrderData(id) {
		this.setState({ orderID: id }, () => this.editOrder.current.showModal());
	}

	updateProductData(data) {
		let product = this.state.product;
		product[0] = data;
		this.setState({ product: product });
	}

	resetOrderID() {
		this.setState({ orderID: '' })
	}

	actionTemplate(rowData) {
		return (
			<React.Fragment>
				<div className="d-flex flex-row align-items-center justify-content-center w-100">
					<i
						style={{ fontSize: "15px" }}
						className="fas fa-pen me-3"
						onClick={() => this.editOrderData(rowData.id)}
					></i>
					{/* <i 
						style={{ fontSize: "15px" }} 
						className="fas fa-trash" 
						onClick={() => {
							if(window.confirm("Are you sure you want to delete?")){
								deleteOrderData(rowData.id).then(
									res => {
										this.getAllOrderDetails()
									}
								).catch(err => console.log(err))
							}
						}}
					></i> */}
				</div>
			</React.Fragment>
		);
	}
	closeModal = () => {
		this.setState({ editProduct: false });

	}
	render() {
		// console.log("this.state.product", this.state.order_details);
		const { t } = this.props
		return (
			<div className='product-detail-layout'>
				<div className="product-detail-section">
					<div className="product-detail-data">
						<div className="product-image">
							<img src="https://kiamotors-portqasim.com/wp-content/uploads/2020/03/Auto-Glass-Cleaner.jpg" alt="" />
						</div>
						<div className="product-detail">
							<div className="product-header">
								<div className="product-title">
									<span className='title'>{this.state.product[0]?.name}</span>
									<span className="quantity mt-3">Qty: {this.state.product[0]?.stock}</span>
								</div>
								<button
									className="btn-white mt-2"
									onClick={() => this.setState({ editProduct: true }, () => this.editProduct.current.showModal())}
								>
									{t('Edit')} <i className='ms-3 fa fa-pencil'></i>
								</button>
							</div>
							<span className="product-description mt-4">{this.state.product[0]?.description}</span>
						</div>
					</div>
					<div className="product-detail-stats">
						<div className='fs-4 fw-bold'>{t('Summary')}</div>
						<div className="summary-box">
							<div className="summary-item">
								<span className="title">{t('No of Purchase')}</span>
								<h6 className="value">{this.state.product[0]?.total_count}</h6>
							</div>
							<div className="summary-item">
								<span className="title">{t('Total Revenue')}</span>
								<h6 className="value">{this.state.product[0]?.total_price}</h6>
							</div>
						</div>
					</div>
				</div>
				<div className="product-order-section">
					<DataTable value={this.state.order_details} scrollable emptyMessage={t('No Record Found')} scrollHeight="100%">
						<Column field="id" header={t('Order ID')}></Column>
						<Column field="user.name" header={t('Customer Name')}></Column>
						<Column field="user.mobile_no" header={t('mobile no')}></Column>
						<Column field="user.email" header={t('Email')}></Column>
						<Column field="tracking_no" header={t('Tracking No')}></Column>
						<Column field="tracking_status" header={t('Status')}></Column>
						<Column field="id" header={t('Action')} body={this.actionTemplate}></Column>
					</DataTable>
				</div>
				{
					(this.state.product.length > 0) && this.state.editProduct ?
						<EditProduct
							ref={this.editProduct}
							product={this.state.product[0]}
							updateProductData={this.updateProductData}
							closeModal={this.closeModal}
						/> : null
				}
				{
					this.state.orderID !== "" ?
						<EditOrder
							ref={this.editOrder}
							orderID={this.state.orderID}
							getAllOrderDetails={this.getAllOrderDetails}
							resetOrderID={this.resetOrderID}
						/> : null
				}
			</div>
		)
	}
}
export default withTranslation()(withRouter(ProductDetail));
