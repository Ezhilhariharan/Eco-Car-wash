import axios from "axios";

export function getManagerData(id){
	return axios.get(`admin/manage_staff/${id}/`);
}