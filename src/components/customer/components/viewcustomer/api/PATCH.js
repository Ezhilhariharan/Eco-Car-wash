import axios from "axios";

export function patchCustomer(id, data) {
  return axios.patch(`/admin/manage_ratings/${id}/`, data);
}