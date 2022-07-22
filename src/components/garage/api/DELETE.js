import axios from "axios";

export function deleteService(service_id, appointment_id, start_time) {
	return axios.patch(`/admin/manage_garage_appointment_services/${appointment_id}/?service=${service_id}`, start_time)
}