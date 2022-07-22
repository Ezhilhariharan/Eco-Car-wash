import axios from "axios";

export function GetFinance(type, date) {
    return axios.get(`/admin/get_finance/?date=${date}&type=${type}`);
}

export function GetFinanceCartypes(type,date) {
    return axios.get(`/admin/get_finance/car_type/?date=${date}&type=${type}`);
}