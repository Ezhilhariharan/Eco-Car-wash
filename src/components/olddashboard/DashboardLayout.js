import { withRouter, NavLink } from "react-router-dom";
import "./styles/DashboardLayout.scss";
import { Chart } from "primereact/chart";
import { getDashBoardData, getAppointmentData } from "./api/Api";
import Piechart from "./graphchart/piechart/Piechart";
import React, { Component } from "react";
import { Progress } from "react-sweet-progress";
import "react-sweet-progress/lib/style.css";
import { Horizontal } from "./graphchart/horizontalchart/Horizontal";
import { Charts } from "./graphchart/chart/Charts";
import flatpickr from "flatpickr";
import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";
let getIndustryList = [{ value: "", label: "Select an industry" }];

class DashboardLayout extends Component {
  constructor(props) {
    super(props);
    var value = new Date().toISOString();
    this.state = {
      industrylist: getIndustryList,
      getuserslist: "",
      webinar: [],
      appiontment: [],
      showWebinarandAppointment: false,
      showpiechart: false,
      star_count: "",
      initialfeedback: [],
      numberCounts: [],
      chartDateCount: [],
    };

    this.myRef = React.createRef();
    this.dashboardData = this.dashboardData.bind(this);
    this.dashboardChart = this.dashboardChart.bind(this);
  }
  dates() {
    flatpickr({
      altInput: true,
      altFormat: "F j, Y",
      dateFormat: "Y-m-d",
    });
  }
  componentDidMount() {
    this.dashboardData();
    this.dashboardChart();
  }

  dashboardData() {
    getDashBoardData()
      .then((res) => {
        // console.log("kalai", res.data.Data);
        this.setState({ numberCounts: res.data.Data });
      })
      .catch((err) => console.log(err));
  }

  dashboardChart() {
    getAppointmentData()
      .then((res) => {
        console.log("thala", res.data.Data);
        this.setState({ chartDateCount: res.data.Data });
      })
      .catch((err) => console.log(err));
  }

  render() {
    return (
      <div className="scroll_dashboards">
        <div className="dashboard ">
          <div className="start_user_list">
            <div className="box_1">
              <div className="empty"></div>
              <div className="user_content">
                <span className="texts">User</span>
                <span className="number">
                  {this.state.numberCounts.user_count}
                </span>
              </div>
              <div className="icon"></div>
            </div>
            <div className="box_1">
              <div className="empty"></div>
              <div className="user_content">
                <span className="texts">Stores</span>
                <span className="number">
                  {this.state.numberCounts.store_count}
                </span>
              </div>
              <div className="icon">
                <span className="icons">
                  <i className="far fa-plus"></i>
                </span>
              </div>
            </div>
            <div className="box_1">
              <div className="empty"></div>
              <div className="user_content">
                <span className="texts">Cleaner</span>
                <span className="number">
                  {this.state.numberCounts.cleaner_count}
                </span>
              </div>
              <div className="icon">
                <span className="icons">
                  <i className="far fa-plus"></i>
                </span>
              </div>
            </div>
            <div className="box_1">
              <div className="empty"></div>
              <div className="user_content">
                <span className="texts">Manager</span>
                <span className="number">
                  {this.state.numberCounts.manager_count}
                </span>
              </div>
              <div className="icon">
                <span className="icons">
                  <i className="far fa-plus"></i>
                </span>
              </div>
            </div>
            <div className="box_1">
              <div className="empty"></div>
              <div className="user_content">
                <span className="texts">Booking</span>
                <span className="number">
                  {this.state.numberCounts.appointment_count}
                </span>
              </div>
              <div className="icon"></div>
            </div>
          </div>

          {/* ---------------charts-------------- */}

          {/* <div className="dashboardgraph d-flex flex-row justify-content-between ">
            <div className="dashboard-piechart-viewmore">
              <div style={{ float: "right", border: "none", outline: "none" }}>
                <select name="Type" onChange={(e) => e.target.value}>
                  <option value="Jan">Jan</option>
                  <option value="Feb">Feb</option>
                </select>
              </div>
              <div>
                
              </div>
              <div
                className="end"
                style={{ float: "right", paddingRight: "20px" }}
              >
                <span className="months">
                  <span className="circle_color">
                    <i className="fas fa-circle"></i>
                  </span>
                  Months
                </span>
              </div>

              <div className="dash_count">
                {this.state.chartDateCount.length > 0 ? (
                  <Charts name={this.state.chartDateCount} />
                ) : (
                  <p>no Data</p>
                )}
              </div>
            </div>
            
            <div className="dashboard-piechart">
              <div className="d-flex flex-row col-12">
                <div className="dashboard-piechart-title col-6 px-3 py-2">
                  Car Type
                </div>
              </div>
              <div> 
                {this.state.numberCounts.hasOwnProperty("car_type_apps") ? (
                  <Piechart data={this.state.numberCounts.car_type_apps} />
                ) : null}
              </div>
            </div>
          </div> */}

          {/*  */}

          <div className="start-main-charts">
            <div className="left_chart">
              <div className="text-content">
                <p>view More</p>
              </div>
              {/* <div className="chart_image">
                {this.state.chartDateCount.length > 0 ? (
                  <Charts name={this.state.chartDateCount} />
                ) : (
                  <p>no Data</p>
                )}
              </div> */}
            </div>
            {/* <div className="right_chart">fsdf</div> */}
          </div>

          {/* ---------end charts------------- */}

          <div className="feed_backs">
            <div className="start">
              <div className="interior">
                <div className="dots_content">
                  <div className="names1">
                    <span>
                      <i className="fas fa-circle circles"></i>
                    </span>
                    <span>Interior </span>
                  </div>
                  <div className="names">
                    <span>
                      <i className="fas fa-circle circle_1"></i>
                    </span>
                    <span className="exterior">Exterior</span>
                  </div>
                </div>
              </div>
              <div>
                <Horizontal />
              </div>
            </div>
            <div className="middle">
              <div className="feed_conten_split">
                <p>Feedback </p>
                <span>View more</span>
              </div>
              <div className="circles_size mt-2">
                <div>
                  <Progress type="circle" width={50} percent={20} />
                  <p className="text-center pt-1">5</p>
                </div>
                <div>
                  <Progress type="circle" width={50} percent={40} />
                  <p className="text-center pt-1">6</p>
                </div>
                <div>
                  <Progress type="circle" width={50} percent={60} />
                  <p className="text-center pt-1">10</p>
                </div>
                <div>
                  <Progress type="circle" width={50} percent={80} />
                  <p className="text-center pt-1">20</p>
                </div>
                <div>
                  <Progress type="circle" width={50} percent={99} />
                  <p className="text-center pt-1">25</p>
                </div>
              </div>
              <div className="back_content p-3">
                <div className="box_splits">
                  <div className="main_inside">
                    <div className="left_person_image">
                      <div className="left_number">1.</div>
                      <div className="right_person_images">
                        <div className="inside_right_image_person">
                          <img
                            src="https://picsum.photos/id/237/200/200"
                            className="dog"
                          />
                        </div>
                        <div className="inside_right_content">
                          <span>Thamarai</span>
                          <div>
                            <span className="fa fa-star checked"></span>
                            <span className="fa fa-star checked"></span>
                            <span className="fa fa-star checked"></span>
                            <span className="fa fa-star checked"></span>
                          </div>
                          <p>Lorem ipsum dolor sit amet.</p>
                        </div>
                      </div>
                    </div>

                    <div className="numbers">4.0</div>
                  </div>
                </div>
                <div className="box_splits">
                  <div className="main_inside">
                    <div className="left_person_image">
                      <div className="left_number">2.</div>
                      <div className="right_person_images">
                        <div className="inside_right_image_person">
                          <img
                            src="https://picsum.photos/id/237/200/200"
                            className="dog"
                          />
                        </div>
                        <div className="inside_right_content">
                          <span>Thamarai</span>
                          <div>
                            <span className="fa fa-star checked"></span>
                            <span className="fa fa-star checked"></span>
                            <span className="fa fa-star checked"></span>
                            <span className="fa fa-star checked"></span>
                          </div>
                          <p>Lorem ipsum dolor sit amet.</p>
                        </div>
                      </div>
                    </div>

                    <div className="numbers">4.0</div>
                  </div>
                </div>
                <div className="box_splits">
                  <div className="main_inside">
                    <div className="left_person_image">
                      <div className="left_number">3.</div>
                      <div className="right_person_images">
                        <div className="inside_right_image_person">
                          <img
                            src="https://picsum.photos/id/237/200/200"
                            className="dog"
                          />
                        </div>
                        <div className="inside_right_content">
                          <span>Thamarai</span>
                          <div>
                            <span className="fa fa-star checked"></span>
                            <span className="fa fa-star checked"></span>
                            <span className="fa fa-star checked"></span>
                            <span className="fa fa-star checked"></span>
                          </div>
                          <p>Lorem ipsum dolor sit amet.</p>
                        </div>
                      </div>
                    </div>

                    <div className="numbers">4.0</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="end">
              <div className="split_box1">
                <div className="box_split_1">
                  <div className="empty"></div>
                  <div className="app_download">
                    <p> App Download </p>
                    <span>45</span>
                  </div>
                  <div></div>
                </div>
              </div>
              <div className="split_box1">
                <div className="box_split_2">
                  <div className="empty"></div>
                  <div className="app_downloads">
                    <p> Leave Approval </p>
                    <span>{this.state.numberCounts.leave_count}</span>
                  </div>
                  <div className="arrows">
                    <NavLink
                      to="/leavedetails"
                      style={{ textDecoration: "none" }}
                      className="arrow"
                    >
                      <i className="fal fa-chevron-right"></i>
                    </NavLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(DashboardLayout);
