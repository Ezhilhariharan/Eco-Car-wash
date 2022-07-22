import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

import EmptyLayout from './components/emptylayout/EmptyLayout'
import CreateProduct from './components/modals/CreateProduct'
import ProductDetail from './components/product/ProductDetail'

import { getProducts } from './api/GET'

import './styles/ECommerceLayout.scss'

class ECommerceLayout extends Component {
	constructor(props) {
		super(props)
		this.state = {
			product: [],
		}
		this.createChild = React.createRef()
		this.openCreateProductModal = this.openCreateProductModal.bind(this)
		this.getProductList = this.getProductList.bind(this)
	}

	componentDidMount() {
		this.getProductList()
	}

	getProductList() {
		getProducts().then(res => {
			console.log(res.data.Data);
			this.setState({
				product: res.data.Data
			})
		}).catch(err => {
			console.log(err)
		})
	}

	openCreateProductModal() {
		this.createChild.current.showModal()
	}

	render() {
		return (
			<div className='e-commerce-layout'>
				{
					(this.state.product.length === 0) ?
						<div className='w-100 h-100'>
							<EmptyLayout openCreateProductModal={this.openCreateProductModal} />
							<CreateProduct ref={this.createChild} getProductList={this.getProductList} />
						</div>
						:
						<ProductDetail product={this.state.product} />
				}
			</div>
		)
	}
}
export default withRouter(ECommerceLayout)