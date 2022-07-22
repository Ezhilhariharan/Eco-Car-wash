import axios from "axios"

export function updateCouponData(id, data) {
  return new Promise((resolve, reject) => {
    axios.patch(`/admin/manage_coupons/${id}/`, data)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  })
}