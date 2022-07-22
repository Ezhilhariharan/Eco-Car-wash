import axios from "axios";

export function getStoreLeaves(data, format, date, to) {
	let reqParams = {}
	if (format == "single") {
		reqParams = { date: date }
	} else {
		reqParams = { from: date, to: to }
	}
	return axios.get(`/admin/manage_user_leave/${data}`, { params: reqParams })
}