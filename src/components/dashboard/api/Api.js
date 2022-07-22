import axios from "axios";

export function getDashBoardData(type, data) {
    console.log("getDashBoardData", type, data);
    // let interval = type
    let date
    if (type == "yearly") {
        // console.log("years", type)
        date = `year=${data}`
    } else {
        // console.log("month", type)
        date = `month=${data}`
    }
    return axios.get(`/admin/get_dashboard/?interval=${type}&${date}`);
}

export function getAppointmentData(type = "yearly", date = null) {
    if (type === "yearly") {
        if (date === null) {
            date = new Date().getFullYear();
        }
        return axios.get(
            `/admin/get_dashboard/appointment_chart/?type=${type}&year=${date}`
        );
    } else {
        if (date === null) {
            date = new Date().getFullYear() + "-" + (new Date().getMonth() + 1);
        }
        // console.log("month", date)
        return axios.get(
            `/admin/get_dashboard/appointment_chart/?type=${type}&month=${date}`
        );
    }
}

// export function getAppointmentData(type, date) {
//     return axios.get(
//         `/admin/get_dashboard/appointment_chart/?type=${type}&month=${date}`
//     );
// }

export function getAdminDateChange(type = "yearly", date = "2022") {
    return axios.get(`/admin/get_finance/?date=${date}&type=${type}`);
}

export function getInteriorData(props, type = "Interior") {
    let interval = props.type
    let date
    if (interval == "yearly") {
        date = `year=${props.date}`
    } else {
        date = `month=${props.date}`
    }
    return axios.get(`/admin/get_dashboard/service_chart/?type=${type}&interval=${interval}&${date}`);
}

export function getExteriorData(props, type = "Exterior") {
    // console.log("Exterior", props);
    let interval = props.type.type
    let date
    if (interval == "yearly") {
        date = `year=${props.type.date}`
    } else {
        date = `month=${props.type.date}`
    }
    return axios.get(`/admin/get_dashboard/service_chart/?type=${type}&interval=${interval}&${date}`);
}
export function getFeedBack(page=1) {
     return axios.get(`/admin/manage_stores/get_store_review/?page_no=${page}`);
}
