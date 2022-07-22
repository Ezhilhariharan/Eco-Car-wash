import { logDOM } from "@testing-library/react";
import axios from "axios";

export function PatchMethodCarModalData(id, editdata) {
    console.log("PatchMethodCarModalData", id, editdata);
    // for (var pair of editdata.entries()) {
    //     console.log(pair[0] + ', ' + pair[1]);
    // }
    return axios.patch(`/admin/manage_carmodel/${id}/`, editdata);
}
