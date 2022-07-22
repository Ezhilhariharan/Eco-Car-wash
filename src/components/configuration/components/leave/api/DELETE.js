import axios from "axios";

export function DeleteLeaveConfig(id){
	return axios.delete(`/admin/manage_leave_config/${id}/`)
}