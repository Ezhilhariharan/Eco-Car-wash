import axios from "axios";

export function updateService(id, data) {
	return new Promise((resolve, reject) => {
		axios.patch(`/admin/manage_garage_appointment_services/${id}/`, data)
			.then(res => {
				resolve(res.data);
			})
			.catch(err => {
				reject(err);
			})
	})
}
export function updateGarage(id, data) {
	return new Promise((resolve, reject) => {
		axios.patch(`admin/manage_garage/${id}/`, data)
			.then(res => {
				resolve(res);
			})
			.catch(err => {
				reject(err);
			})
	})
}