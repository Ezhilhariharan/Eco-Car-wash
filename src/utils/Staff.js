import axios from "axios";
import React from "react";
import ManagerLayout from "../components/manager/ManagerLayout";
import { Modal } from "bootstrap";

let pagination = true
export class Staff {

  getStaff(userType, page = 1, searchValue) {
    let Params = {};
    if (searchValue !== "") {
      Params = { name: searchValue };
    }
    return axios.get(`/admin/manage_staff/?user_type=${userType}&page_no=${page}&pagination=true`, { params: { search: JSON.stringify(Params) } });
  }

  nameTemplate(rowData) {
    return (
      <React.Fragment>
        <img
          alt={rowData.name}
          src={
            rowData.profile_image
              ? rowData.profile_image
              : `https://avatars.dicebear.com/api/initials/${rowData.name}.svg`
          }
          onError={(e) =>
          (e.target.src =
            "https://avatars.dicebear.com/api/initials/random.svg")
          }
          width={50}
          style={{ verticalAlign: "middle" }}
          className="border rounded-circle table_circle me-3"
        />
        <span className="ms-3">{rowData.name}</span>
      </React.Fragment>
    );
  }
  store_nameTemplate(rowData) {
    return (
      <React.Fragment>
        <span className="ms-3">{rowData.store_name}</span>
      </React.Fragment>
    );
  }
  phoneTemplate(rowData) {
    return (
      <React.Fragment>
        <div className="d-flex flex-row align-items-center">
          <span>
            <i className="fas fa-phone-alt"></i>&nbsp; {rowData.mobile_no}
          </span>
        </div>
      </React.Fragment>
    );
  }

  emailTemplate(rowData) {
    return (
      <React.Fragment>
        <div className="d-flex flex-row" style={{
          maxWidth: '200px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          <span>
            <i className="far fa-envelope"></i>&nbsp; {rowData.email}
          </span>
        </div>
      </React.Fragment>
    );
  }

  leaveTemplate(rowData) {
    return (
      <React.Fragment>
        <span className="mx-auto" style={{ fontSize: "30px" }}>{rowData.leave_taken}/{rowData.total_leave}</span>
      </React.Fragment>
    );
  }

  orderTemplate(rowData) {
    return (
      <React.Fragment>
        <span className="mx-auto" style={{ fontSize: "40px" }}>
          {rowData.completed_appointments}
        </span>
      </React.Fragment>
    );
  }

  editTemplate(rowData) {
    return (
      <React.Fragment>
        <i
          style={{ fontSize: "20px" }}
          className="fas fa-pen mx-auto"
          onClick={() => {
            axios
              .get(`/admin/manage_staff/${rowData.username}/`)
              .then((res) => {
                if (res.data.Status) {
                  let result = res.data.Data
                  console.log(result);
                  document.getElementById('edited_username').value = result.username;
                  document.getElementById('edited_name').value = result.name;
                  document.getElementById('edited_email').value = result.email;
                  document.getElementById('edited_mobile_no').value = result.mobile_no;

                  var myModal = new Modal(
                    document.getElementById("editmod")
                  );
                  myModal.show();
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }}
        />
      </React.Fragment>
    );
  }
}
