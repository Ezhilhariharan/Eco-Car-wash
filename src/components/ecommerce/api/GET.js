import axios from "axios";

export function getProducts(){
	return axios.get("/admin/manage_products/");
}

export function getOrderDetails(product_id){
	return axios.get(`/admin/manage_order_details/?product_id=${product_id}`);
}

export function getOrderData(id){
	return axios.get(`/admin/manage_order_details/${id}/`);
}