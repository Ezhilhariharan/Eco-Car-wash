import axios from "axios";

export function postCarType(data) {
    return new Promise((resolve, reject) => {
        axios
            .post("/admin/manage_cartype/", data)
            .then((res) => resolve(res.data))
            .catch((err) => reject(err));
    });
}
