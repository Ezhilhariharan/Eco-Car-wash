import axios from "axios";

export function getCarTypes() {
	return axios.get(`/admin/manage_cartype/`)
}

export function getCarTypeSelection(store_id, car_type = "") {
	return axios.get(`/admin/manage_service_mapping/?store=${store_id}`)
}

export function getAllServices(cartype) {
	return axios.get(`/admin/manage_services/?car_type=${cartype}&status=active`)
}
