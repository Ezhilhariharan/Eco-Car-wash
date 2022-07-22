import axios from "axios"

export function updateService(id, data) {
  return new Promise((resolve, reject) => {
    axios.patch(`/admin/manage_services/${id}/`, data).then(
      res => resolve(res)
    ).catch(
      err => reject(err)
    )
  })
}