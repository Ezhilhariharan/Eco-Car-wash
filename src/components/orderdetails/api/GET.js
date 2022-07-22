import axios from "axios";

export function getOrderDetails(data = "", pagenum) {
    return axios.get(`/admin/manage_appointments${data}&page_no=${pagenum}`)
}

export function getOrderData(id) {
    return axios.get(`/admin/manage_appointments/${id}`)
}