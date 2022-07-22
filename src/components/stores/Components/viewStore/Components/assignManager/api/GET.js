import axios from "axios";

export function getManagerList(store_id){
	return axios.get(`/admin/manage_staff/?user_type=2&not_store=${store_id}`)
}


