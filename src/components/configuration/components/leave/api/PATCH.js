import axios from "axios";

export function updateLeaveStatus(id, data) {
	return new Promise((resolve, reject) => {
		axios.patch(`/admin/manage_leave_config/${id}/`, data).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}

export function updateLeaveConfig(id, data) {
	return new Promise((resolve, reject) => {
		axios.patch(`/admin/manage_leave_config/${id}/`, data)
			.then(response => {
				resolve(response);
			})
			.catch(error => {
				reject(error);
			});
	})
}

export function updateLeaveCount(id, data) {
	return new Promise((resolve, reject) => {
		axios.patch(`/admin/manage_leave_count/${id}/`, data)
			.then(response => {
				resolve(response);
			})
			.catch(error => {
				reject(error);
			});
	})
}