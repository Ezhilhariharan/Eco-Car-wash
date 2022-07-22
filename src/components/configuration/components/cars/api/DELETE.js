import axios from "axios";

export function DeleteCarMakeData(id) {
    return axios.delete(`/admin/manage_carmake/${id}/`);
}
