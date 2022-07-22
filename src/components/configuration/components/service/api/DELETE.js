import axios from "axios";

export function deleteService(id){
  return axios.delete(`/admin/manage_services/${id}/`);
}