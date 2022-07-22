import axios from "axios";

export function DeleteCarTypes(id) {
    return axios.delete(`/admin/manage_cartype/${id}/`);
}
