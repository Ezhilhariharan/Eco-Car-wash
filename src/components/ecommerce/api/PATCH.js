import axios from "axios";

export function updateProduct(id, product) {
	return new Promise((resolve, reject) => {
		axios.patch(`/admin/manage_products/${id}/`, product).then(res => {
			resolve(res);
		}).catch(err => {
			reject(err);
		})
	})
}

export function updateOrderData(id, product) {
	return new Promise((resolve, reject) => {
		axios.patch(`/admin/manage_order_details/${id}/`, product).then(res => {
			resolve(res);
		}).catch(err => {
			reject(err);
		})
	})
}