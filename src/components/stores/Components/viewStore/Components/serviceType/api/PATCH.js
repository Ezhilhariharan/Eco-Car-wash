import axios from "axios";

export function patchStoreServiceMapping(data) {
	return new Promise((resolve, reject) => {
		axios.patch(`admin/manage_service_mapping/updater/`, data).then(
			res => resolve(res),
			err => reject(err)
		)
	})
}