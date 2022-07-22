import React from "react";

export class StoreStaffLeaves {
  idTemplate(rowData) {
    return (
      <React.Fragment>
        <span>{rowData.id}</span>
      </React.Fragment>
    );
  }

  leaveTitleTemplate(rowData) {
    return (
      <React.Fragment>
        <div className="d-flex flex-row">
          <span>{rowData.title}</span>
        </div>
      </React.Fragment>
    );
  }

  leaveDescriptionTemplate(rowData) {
    return (
      <React.Fragment>
        <div className="d-flex flex-row">
          <span>{rowData.description}</span>
        </div>
      </React.Fragment>
    );
  }

  fromTemplate(rowData) {
    return (
      <React.Fragment>
        <div className="d-flex flex-row">
          <span>{rowData.from_date}</span>
        </div>
      </React.Fragment>
    );
  }

  toTemplate(rowData) {
    return (
      <React.Fragment>
        <div className="d-flex flex-row">
          <span>{rowData.to_date}</span>
        </div>
      </React.Fragment>
    );
  }

  leaveTemplate(rowData) {
    return <React.Fragment>
      <div className="d-flex flex-row">
          <span>{rowData.days}</span>
        </div>
    </React.Fragment>;
  }
}
