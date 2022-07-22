import React, { Component } from 'react'
import { withRouter, Switch, Route } from 'react-router-dom'

import OrderSummary from './components/ordersummary/OrderSummary';
import OrderList from './components/orderlist/OrderList';

import './styles/OrderLayout.scss'

let url;
class OrderLayout extends Component {
	constructor(props) {
		super(props)
		url = this.props.match.path;
		// console.log("OrderLayout",url);
	}
	render() {
		return (
			<div className='order-layout'>
				<Switch>
					<Route exact path={`${url}/`} component={OrderList} />
					<Route exact path={`${url}/:id`} component={OrderSummary} />
				</Switch>
			</div>
		)
	}
}
export default withRouter(OrderLayout)