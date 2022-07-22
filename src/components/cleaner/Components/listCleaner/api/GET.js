import axios from "axios";

export function getCleanerData(id) {
    return axios.get(`admin/manage_staff/${id}/`);
}
