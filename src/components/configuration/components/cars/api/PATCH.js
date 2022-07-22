import axios from "axios";

export function PatchCarMakeData(data, id) {
    return axios.patch(`/admin/manage_carmake/${id}/`, data);
}
