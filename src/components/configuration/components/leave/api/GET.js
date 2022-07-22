import axios from "axios";

export function getLeaveConfigs() {
    return axios.get(`/admin/manage_leave_config/`);
}

export function getSingleLeaveConfig(id) {
    return axios.get(`/admin/manage_leave_config/${id}/`);
}

export function getLeaveCount() {
    return axios.get(`/admin/manage_leave_count/`);
}
