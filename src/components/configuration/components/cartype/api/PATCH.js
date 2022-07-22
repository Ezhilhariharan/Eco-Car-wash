import axios from "axios";

export function UpdateCarTypes(id, data) {
    return axios.patch(`/admin/manage_cartype/${id}/`, data);
}
