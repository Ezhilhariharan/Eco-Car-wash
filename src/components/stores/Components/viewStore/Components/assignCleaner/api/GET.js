import axios from "axios";

export function getCleanerList(store_id){
	return axios.get(`/admin/manage_staff/?user_type=3&not_store=${store_id}`)
}