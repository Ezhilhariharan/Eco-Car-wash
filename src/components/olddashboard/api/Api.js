import axios from "axios";

export function getDashBoardData() {
  return axios.get("/admin/get_dashboard/");
}

export function getAppointmentData(type = "yearly", date = "2022") {
  if (type === "yearly")
    return axios.get(
      `/admin/get_dashboard/appointment_chart/?type=${type}&year=${date}`
    );
  else
    return axios.get(
      `/admin/get_dashboard/appointment_chart/?type=${type}&month=${date}`
    );
}
