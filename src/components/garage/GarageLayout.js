import React, { Component } from 'react'
import { withRouter, Switch, Route } from 'react-router-dom'

import GarageList from './components/garagelist/GarageList'
import GarageView from './components/garageview/GarageView'
import GarageAppointment from './components/garageappointment/GarageAppointment'
import GarageService from './components/garageservice/GarageService'
import GarageAppointmentList from './components/garageappointmentlist/GarageAppointmentList'

import './styles/GarageLayout.scss'

let url;
class GarageLayout extends Component {
	constructor(props){
		super(props)
		url = this.props.match.url
		console.log(url);
	}
	render() {
		return (
			<div className='garage-layout'>
				<Switch>
					<Route exact path={`${url}/`} component={GarageList} />
					<Route exact path={`${url}/:id`} component={GarageView} />
					<Route path={`${url}/service/:id`} component={GarageService} />
					<Route path={`${url}/appointment/:id`} component={GarageAppointment} />
					<Route path={`${url}/appointments/:id`} component={GarageAppointmentList} />
				</Switch>
			</div>
		)
	}
}
export default withRouter(GarageLayout)