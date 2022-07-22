import axios from "axios";

export function updateUserLeave(id, data) {
    return new Promise((resolve, reject) => {
        axios
            .patch(`/admin/manage_user_leave/${id}/`, data)
            .then((res) => {
                resolve(res.data);
            })
            .catch((err) => {
                reject(err);
            });
    });
}
