import { Component } from "react";
import { withRouter } from "react-router";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
// import Premium from "./Component/premium/Premium";
// import Standard from "./Component/services/Standard";
import SwitchTabs from "../switchTabs/SwitchTabs";
import axios from "axios";

import "./styles/ServicesLayout.scss";

class ServicesLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      carList: [],
      carType: "",
      serviceNature: "interior",
    };
  }

  componentDidMount() {
    axios
      .get(`/admin/manage_cartype/`)
      .then((res) => {
        console.log(res.data);
        this.setState({ carList: res.data.Data });
        this.setState({ carType: res.data.Data[0].name });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  changeNature(value) {
    this.setState({ serviceNature: value });
    document.getElementById("exteriorTab").classList.remove("active");
    document.getElementById("interiorTab").classList.remove("active");
    document.getElementById(value + "Tab").classList.add("active");
  }

  render() {
    return (
      <div className="configuration-section d-flex flex-column col">
        <div classNameName="row configuration-dashboard">
        
          <div className="pt-2 pb-5 d-flex justify-content-between align-items-center">
            <h5
              className="me-5 my-auto fw-normal"
              style={{ width: "120px" }}
              aria-current="page"
            >
              Car Type
            </h5>

            <div
              className="w-100 d-flex flex-row align-items-center"
              style={{ overflow: "auto", height: "60px" }}
            >
              {this.state.carList.map((car) => (
                <a className=" me-3 btn-config" aria-current="page" href="#">
                  {car.name}
                </a>
              ))}
            </div>

            <a className="nav-item btn-config mx-3">+ Add</a>
          </div>
          <h4 className="pt-3">Service types</h4>
        </div>
       

        <div className="d-flex justify-content-around line">
          <h5
            className="tabs active"
            id="interiorTab"
            onClick={() => this.changeNature("interior")}
          >
            Interior
          </h5>
          <h5
            className="tabs"
            id="exteriorTab"
            onClick={() => this.changeNature("exterior")}
          >
            Exterior
          </h5>
        </div>

        <div className="row configuration-body pt-3">
          <div className="d-flex flex-row" style={{ height: "100%" }}>
            <div className="col-6 w-50 h-100 px-3">
              <div className="d-flex flex-row p-4 h-25">
                <h5 className="mx-auto">Standard</h5>
                <a
                  className="nav-item btn-config me-3"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                >
                  + Add
                </a>
              </div>

              <div className="d-flex flex-row h-75">
                <DataTable
                  value={this.state.carList}
                  scrollable
                  scrollHeight="100%"
                >
                  <Column
                    field="name"
                    // body={this.Staff.nameTemplate}
                  ></Column>
                  <Column
                    field="mobile_no"
                    // body={this.Staff.phoneTemplate}
                  ></Column>
                  <Column
                    field="email"
                    // body={this.Staff.emailTemplate}
                  ></Column>
                  <Column
                    field="leave"
                    // body={this.Staff.leaveTemplate}
                  ></Column>
                  <Column
                    field="orders"
                    // body={this.Staff.orderTemplate}
                  ></Column>
                </DataTable>
              </div>
            </div>

            <div className="col-6 w-50 h-100">
              {/* <Premium /> */}
              <div className="w-100">
                <div className="d-flex flex-row p-4">
                  <h5 className="mx-auto">Premium</h5>
                  <a
                    className="nav-item btn-config me-3"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                  >
                    + Add
                  </a>
                </div>
                <div className="p-5">
                  <p>Fabric cleaning / CHF 15 - $200</p>
                  <p>Interior disinfection / CHF 24 - $100</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="modal fade"
          id="exampleModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
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

export default withRouter(ServicesLayout);
