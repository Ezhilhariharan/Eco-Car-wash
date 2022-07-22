import axios from "axios";

export function GetCreateCarType() {
    return axios.get(`/admin/manage_cartype/`);
}

export function GetCarTypeValues(id) {
    return axios.get(`/admin/manage_cartype/${id}`);
}


