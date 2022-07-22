import axios from "axios";

export function createProduct(product) {
	return new Promise((resolve, reject) => {
		axios.post("/admin/manage_products/", product).then(res => {
			resolve(res);
		}).catch(err => {
			reject(err);
		})
	})
}