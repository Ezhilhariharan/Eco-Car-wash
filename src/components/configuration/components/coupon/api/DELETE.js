import axios from "axios";

export function deleteCouponData(id){
  return new Promise((resolve, reject) => {
    axios.delete(`/admin/manage_coupons/${id}/`)
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  })
}