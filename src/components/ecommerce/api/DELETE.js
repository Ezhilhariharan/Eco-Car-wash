import axios from "axios";

export function deleteOrderData(id) {
  return axios.delete(`/admin/manage_order_details/${id}/`);
}