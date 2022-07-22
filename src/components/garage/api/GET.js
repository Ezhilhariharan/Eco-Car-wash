import axios from "axios";

export function getGarageList(pagenum = 1) {
	return axios.get(`/admin/manage_garage/?page_no=${pagenum}`);
}

export function getGarageData(id) {
	return axios.get(`/admin/manage_garage/${id}/`);
}

export function getGarageAppointmentList(user_id, page_num = 1) {
	return axios.get(`/admin/manage_garage_appointments/?user_id=${user_id}&page_no=${page_num}`);
}

export function getGarageAppointmentData(appointment, date) {
	return axios.get(`/admin/manage_garage_appointments/${appointment}/`,);
}

export function getGarageAppointmentServicesList(appointment, username = "", date = "") {
	return axios.get(`/admin/manage_garage_appointment_services/?appointment=${appointment}&cleaner=${username}&date=${date}`);
}

export function getAppointmentServiceData(id) {
	return axios.get(`/admin/manage_garage_appointment_services/${id}/`);
}

export function getGarageServices(garage) {
	return axios.get(`/admin/manage_garage_services/?garage=${garage}`);
}

export function getCompletedGarageAppointmentList(user_id, page_num = 1) {
	return axios.get(`/admin/manage_garage_appointments/?user_id=${user_id}&status=completed&page_no=${page_num}`);
}

export function getAllServices(car_type) {
	return axios.get(`/admin/manage_services?car_type=${car_type}`);
}