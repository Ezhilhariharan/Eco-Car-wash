import axios from "axios";

export function patchManagerData(id, data) {
	return new Promise((resolve, reject) => {
		axios.patch(`admin/manage_staff/${id}/`, data).then(
			res => {
				resolve(res)
			}
		).catch(err => reject(err))
	})
}