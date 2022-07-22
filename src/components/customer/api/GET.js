import axios from "axios";

export function getCustomerData(username){
	return axios.get(`/admin/manage_customer/${username}/`)
}

export function getCustomerRating(username){
	return axios.get(`/admin/manage_ratings/?customer=${username}`)
}