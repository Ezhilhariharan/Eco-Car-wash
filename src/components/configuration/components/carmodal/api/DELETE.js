import axios from "axios";

export function DeleteCarMOdalDataId(id) {
    return axios.delete(`/admin/manage_carmodel/${id}/`);
}
