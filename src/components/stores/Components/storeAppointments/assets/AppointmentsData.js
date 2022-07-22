import React from "react";

export class AppointmentsData {
  nameTemplate(rowData) {
    return (
      <React.Fragment>
        <img
          alt={rowData.customer.name}
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
          className="border rounded-circle me-3"
        />
        <span>{rowData.customer.name}</span>
      </React.Fragment>
    );
  }

  leaveTemplate(rowData) {
    return (
      <React.Fragment>
        <div className="d-flex flex-column align-items-center">
          <span className="row">Leave taken</span>
          <span className="row" style={{ fontSize: "40px" }}>
            04
          </span>
        </div>
      </React.Fragment>
    );
  }

  orderTemplate(rowData) {
    return (
      <React.Fragment>
        <div className="d-flex flex-column align-items-center">
          <span className="row">No. of orders</span>
          <span className="row" style={{ fontSize: "40px" }}>
            256
          </span>
        </div>
      </React.Fragment>
    );
  }

  phoneTemplate(rowData) {
    return (
      <React.Fragment>
        <div className="d-flex flex-row align-items-center justify-content-center text-nowrap">
            <i className="fas fa-phone-alt me-2"></i> {rowData.customer.mobile_no}
        </div>
      </React.Fragment>
    );
  }

  emailTemplate(rowData) {
    return (
      <React.Fragment>
        <div className="d-flex flex-row align-items-center justify-content-center text-nowrap">
          <span>
            <i className="far fa-envelope"></i>&nbsp; {rowData.customer.email}
          </span>
        </div>
      </React.Fragment>
    );
  }
}
