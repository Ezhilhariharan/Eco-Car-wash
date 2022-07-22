import axios from "axios";

export function assignStoreManager(manager_username,data){
	return axios.patch(`/admin/manage_staff_mapping/${manager_username}/`,data)
}
