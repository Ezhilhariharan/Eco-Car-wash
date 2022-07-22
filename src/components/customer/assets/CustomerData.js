import React from "react";

export class CustomerData {
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
        <span>{rowData.name}</span>
      </React.Fragment>
    );
  }

  phoneTemplate(rowData) {
    return (
      <React.Fragment>
        <div className="d-flex flex-column align-items-center">
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
        <div className="d-flex flex-column align-items-center">
          <span>
            <i className="far fa-envelope"></i>&nbsp;{rowData.email}
          </span>
        </div>
      </React.Fragment>

    );
  }

  carTypeTemplate(rowData) {
    return (
      <React.Fragment>
        <div className="d-flex flex-column col-8 align-items-center">
          <span className="car_type" style={{ fontSize: "35px" }}>
            {rowData.user_cars.car_type}
          </span>
        </div>
      </React.Fragment>
    );
  }

  appointmentTemplate(rowData) {
    return (
      <React.Fragment>
        <div className="d-flex flex-column align-items-center">
          <span className="row" style={{ fontSize: "40px" }}>
            {rowData.totalapps}
          </span>
        </div>
      </React.Fragment>
    );
  }

}