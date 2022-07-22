import "./styles/LeavesLayout.scss";
import React, { Component } from "react";
import { Holidays } from "../../../../utils/Holidays"; 
import { withRouter } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Staff } from "../../../../utils/Staff";
import axios from "axios";
import { NavLink } from "react-router-dom";

class LeavesLayout extends Component {

    constructor(props) {
        super(props);
        this.state = {
          list: [],
        };
        this.Holidays = new Holidays();
       // this.selectedRow=this.selectedRow.bind(this)
      }

      getHolidays() {
        this.Holidays.getHolidays(3)
        .then((res) => {
          console.log(res.data);
          this.setState({ list: res.data.Data });
        })
        .catch((err) => {
          console.log(err);
        });
      }

      componentDidMount() {
        this.getHolidays();
      }
    
  render() {
    return (
      <div className="leaves-layout">
        <div className="leaves-add">
        <a
          className="nav-item btn-config ms-auto"
          data-bs-toggle="modal"
          data-bs-target="#leaveModal"
        >
          + Add
        </a>
        </div>

        <div className="leaves-list">
          <DataTable value={this.state.list} scrollable scrollHeight="100%" onRowClick={this.selectedRow}>
            <Column field="name" body={this.Holidays.snoTemplate}></Column>
            <Column field="name" body={this.Holidays.leaveNameTemplate}></Column>
            <Column field="name" body={this.Holidays.dateTemplate}></Column>
            <Column field="name" body={this.Holidays.toggleTemplate}></Column>
            <Column field="name" body={this.Holidays.editTemplate}></Column>

          </DataTable>
        </div>



        <div
          className="modal fade"
          id="leaveModal"
          tabIndex="-1"
          aria-labelledby="leaveModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body mx-auto">
                <h6>Title</h6>
                <input type="text" className="mb-3"></input>
                <h6>Pricing</h6>
                <input type="number"></input>
                <h6>Time</h6>
                <input type="number"></input>
              </div>
              <div className="modal-footer" style={{ border: "none" }}>
                <button
                  type="button"
                  data-bs-dismiss="modal"
                  className="btn-navy mx-auto"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LeavesLayout;
