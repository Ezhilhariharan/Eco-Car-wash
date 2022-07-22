import axios from "axios";

export function CarMakePostData(carData) {
    return axios.post(`/admin/manage_carmake/`, carData);
}
