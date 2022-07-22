import axios from "axios";

export function GetCarModalData(data) {
    console.log("car modal id", data);
    return axios.get(`/admin/manage_carmodel/?car_make=${data}`);
}

export function GetCarModalDataEditId(id) {
    return axios.get(`/admin/manage_carmodel/${id}`);
}
