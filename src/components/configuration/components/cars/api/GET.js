import axios from "axios";

export function getCarMakeData(cartypeid) {
    console.log("cartypeid", cartypeid);
    return axios.get(`/admin/manage_carmake/?car_type=${cartypeid}`);
}

export function CarMakeGetEdit(id) {
    return axios.get(`/admin/manage_carmake/${id}/`);
}
