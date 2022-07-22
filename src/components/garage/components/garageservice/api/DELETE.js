import axios from "axios";

export function deleteService(id){
  return axios.delete(`/admin/manage_garage_services/${id}/`);
}