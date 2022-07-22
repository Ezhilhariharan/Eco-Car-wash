import axios from "axios";

export function PostCarModalData(data) {
    return axios.post(`/admin/manage_carmodel/`, data);
}
