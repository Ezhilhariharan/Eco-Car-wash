import axios from "axios";

export function createLeaveConfig(data) {
	return new Promise((resolve, reject) => {
		axios.post(`/admin/manage_leave_config/`, data)
			.then(response => {
				resolve(response);
			})
			.catch(error => {
				reject(error);
			});
	})
}

export function createLeaveCount(data) {
	return new Promise((resolve, reject) => {
		axios.post(`/admin/manage_leave_count/`, data)
			.then(response => {
				resolve(response);
			})
			.catch(error => {
				reject(error);
			});
	})
}