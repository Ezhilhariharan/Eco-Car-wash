import React, { Component } from 'react'
import { withRouter } from "react-router";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import axios from "axios";
import flatpickr from "flatpickr";
import { withTranslation } from 'react-i18next';
import { AppointmentsData } from "./assets/AppointmentsData";
import "./styles/StoreAppointments.scss";

const monthString = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

let id
class StoreAppointments extends Component {
  constructor(props) {
    super(props)
    this.state = {
      month: `${monthString[new Date().getMonth()]} ${new Date().getFullYear()}`,
      currentDate: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`,
      appointmentsList: [],
      cleanerList: [],
      lock: false,
      page: 1,
      status: "",
      checkList: [],
    }
    id = this.props.match.params
    this.appointment = new AppointmentsData()
    this.flatpick = React.createRef();
    this.scrollLoader = this.scrollLoader.bind(this);
    console.log("id", id.id);
  }
  componentDidMount() {
    flatpickr(this.flatpick.current, {
      defaultDate: this.state.currentDate,
      dateFormat: "Y-m-d",
      onChange: (selectedDates, dateStr, instance) => {
        // setDate(dateStr) 
        this.setState({ currentDate: dateStr }, () => this.loadAppointmentData(true));
      }
    })
    // 
    this.scrollLoader()
    this.loadAppointmentData()
    this.loadCleanerData()
    try {
      let status = id.id.split("&")[0]
      this.setState({ status: status.split("=")[1] });
      // console.log("status", status.split("=")[1]);

    } catch {

    }
  }
  scrollLoader() {
    let scroller = document.getElementsByClassName(
      "p-datatable-scrollable-body"
    )[0];
    let scrollerBody = document.getElementsByClassName(
      "p-datatable-scrollable-body-table"
    )[0];
    scroller.addEventListener("scroll", () => {
      if (
        scroller.scrollTop >
        (scrollerBody.clientHeight - scroller.clientHeight) * 0.9
      ) {
        if (!this.state.lock && this.state.appointmentsList.next) {
          this.setState({ lock: true }, () => {
            this.setState({ page: this.state.page + 1 }, () => {
              this.loadAppointmentData();
            });
          });
        }
      }
    });
  }
  loadAppointmentData = (reset = false) => {
    let list;
    axios
      .get(`/admin/manage_appointments/?${id.id}&date=${this.state.currentDate}&page_no=${this.state.page}`)
      .then((res) => {
        console.log('appointment ', res.data.Data);
        if (res.data.Status) {
          if (Object.keys(this.state.appointmentsList).length !== 0 && !reset) {
            list = this.state.appointmentsList.results;
            list.push(...res.data.Data.results);
            res.data.Data.results = list;
            this.setState({ appointmentsList: res.data.Data, checkList: res.data.Data.results });
          } else {
            this.setState({ appointmentsList: res.data.Data, checkList: res.data.Data.results });
          }
          this.setState({ lock: false });
        } else {
          console.error(res);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  loadCleanerData = () => {
    axios
      .get(`/admin/manage_user_leave/?store=${id.id}&date=${this.state.currentDate}`)
      .then((res) => {
        console.log('cleaner list', res.data.Data);
        if (res.data.Status) {
          // setCleanerList(res.data.Data)
          this.setState({ cleanerList: res.data.Data })
        } else {
          console.error(res);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  onAppointmentClick = (rowData) => {
    this.props.history.push(`/orderdetails/${rowData.data.id}`)
  }

  printDate = () => {
    let date = new Date(this.state.currentDate);
    return `${date.getDate()} ${date.toLocaleString("en-us", { month: "long" })} ${date.getFullYear()}`;
  }

  render() {
    // console.log("appointmentsList", this.state.appointmentsList.results);
    const { t } = this.props
    return (
      <div className="store-appointments">
        <div className="store-appointments-head">
          <button className="btn-navy-circle me-4" onClick={() => this.props.history.goBack()}><i className="fa fa-chevron-left"></i></button>
          <h1 className="w-100">{t(`${this.state.status}`)} {t('Bookings')}</h1>
          <div className="absentee-section">
            {
              this.state.cleanerList.map((cleaner, index) => {
                return (
                  <div className="absentee-tab col-4" key={index} onClick={() => {
                    this.props.history.push(`/leavedetails?cleaner=${cleaner.user.username}`)
                  }}>
                    <div className="absentee-profile-picture col-4 ms-2">
                      <img src="https://picsum.photos/40" />
                    </div>
                    <p className="ms-2 my-auto col-5">{cleaner.user.name}</p>
                    <p className="ms-auto my-auto col-3" style={{ color: "#6DDFD8" }}>{t('On Leave')}</p>
                  </div>
                )
              })
            }
          </div>
        </div>

        <div className="store-appointments-body">
          <div className="appointments-calendar">
            <div className="date">
              {
                this.printDate()
              }
            </div>
            <div className="appointment-count mt-3">
              {/* {this.state.appointmentsList.results} */}
              {t('Appointments')}
            </div>
            <div className="month-setter mt-3 w-50">
              <label htmlFor="" style={{ color: 'white' }}>{t('Select date')}:</label>
              <input
                type="date"
                className="form-control"
                onChange={(e) => this.setState({ currentDate: e.target.value }, () => this.loadAppointmentData(true))}
                ref={this.flatpick}
              />
              <i className="fas fa-calendar"></i>
            </div>
            <div className="calendar mt-5">
              {/* <Calendar /> */}
            </div>
          </div>
          <div className="appointments-table">
            <DataTable value={this.state.appointmentsList.results} emptyMessage={t('No Record Found')} scrollable scrollHeight="100%" responsiveLayout="scroll" onRowClick={this.onAppointmentClick}>
              <Column field="name" header={t('Name')} body={this.appointment.nameTemplate}></Column>
              <Column field="mobile_no" header={t('mobile no')} body={this.appointment.phoneTemplate}></Column>
              <Column field="email" header={t('email')} body={this.appointment.emailTemplate}></Column>
              <Column field="start_time" header={t('Time')}></Column>
              <Column field="appointment_nature" header={t('Type')}></Column>
              <Column field="appointment_status" header={t('Status')}></Column>
            </DataTable>

          </div>
        </div>
      </div>
    )
  }
}
//
export default withTranslation()(withRouter(StoreAppointments))
