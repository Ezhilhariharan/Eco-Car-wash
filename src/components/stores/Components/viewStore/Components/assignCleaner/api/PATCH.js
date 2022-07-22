import axios from "axios";


export function assignStoreCleaner(data){
	return axios.patch(`/admin/manage_staff_mapping/update_cleaners/`,data)
}