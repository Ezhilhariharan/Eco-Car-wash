import axios from "axios";
import React, { Component } from "react";
import Switch from "react-switch";



export class Holidays {

  // constructor() {
  //   super();
  //   this.state = { checked: false };
  //   this.handleChange = this.handleChange.bind(this);
  // }
  
  // handleChange(checked) {
  //   this.setState({ checked });
  // }

  getHolidays() {
    return axios.get(`/admin/manage_leave_config/`);
  }

  snoTemplate(rowData) {
    return (
      <React.Fragment>
        <span>{rowData.id}</span>
      </React.Fragment>
    );
  }

  leaveNameTemplate(rowData) {
    return (
      <React.Fragment>
        <p>
          <span>{rowData.name}</span>
        </p>
      </React.Fragment>
    );
  }

  dateTemplate(rowData) {
    return (
      <React.Fragment>
        <p>
          <span>{rowData.date}</span>
        </p>
      </React.Fragment>
    );
  }

  toggleTemplate(rowData) {
    return (
      <React.Fragment>
        <Switch offHandleColor={"FFFFFF"} onHandleColor={"FFFFFF"} offColor={"#B3B3B3"} onColor={"#04294B"} checkedIcon={false} uncheckedIcon={false} onChange={this.handleChange}   />
      </React.Fragment>
    );
  }

  editTemplate(rowData) {
    return (
      <React.Fragment>
        <div>
        <i style={{fontSize:"20px"}} className="fas fa-pen me-5"></i>
        <i style={{fontSize:"20px"}} className="fas fa-times ms-5"></i>
        </div>
      </React.Fragment>
    );
  }


}


