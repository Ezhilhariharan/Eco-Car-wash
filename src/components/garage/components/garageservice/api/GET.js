import axios from "axios";

export function getCarTypeList(){
	return axios.get(`/admin/manage_cartype/`);
}

export function getServices(garage,carType, serviceType, serviceNature){
	return axios.get(`/admin/manage_garage_services/?garage=${garage}&car_type=${carType}&service_nature=${serviceNature}&service_type=${serviceType}`);
}

export function getService(id){
	return axios.get(`/admin/manage_garage_services/${id}/`)
}

export function getServiceData(carType, serviceType, serviceNature){
	return axios.get(`/admin/manage_services/?car_type=${carType}&service_nature=${serviceNature}&service_type=${serviceType}`);
}