import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import axios from "axios";
import { getOrderDetails } from "../../api/GET";
import { withTranslation } from 'react-i18next';
import "./styles/OrderList.scss";

let data, storePath, title;
class OrderList extends Component {
  constructor(props) {
    super(props);
    // url = this.props.match.path;
    this.state = {
      orderDetail: [],
      currentDate: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`,
      studentCount: "",
      studentResultsLength: "",
      page: 1,
      lock: false
      // state_Url:url,
    };
    this.loadAppointment = this.loadAppointment.bind(this);
    this.scrollLoader = this.scrollLoader.bind(this);
  }
  componentDidMount() {
    try {
      data = "?" + window.location.href.split("?")[1];
      storePath = window.location.href.split("?")[1];
      let path = storePath.split("&")[0]
      title = path.split("=")[1]
      // console.log("order-list-title", data, typeof data);
      if (data === "?status=Booking") {
        // console.log("order-list-title", data);
        data = "?status=All"
      }

      if (storePath.split("&")[0]) {
        this.orderDetails()
      } else {
        let appointment_id = storePath.split("&")[1].split("=")[1]
        this.loadAppointmentData(appointment_id)
      }
      this.scrollLoader();
    } catch {
      data = "";
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
        if (!this.state.lock && this.state.orderDetail.next) {
          this.setState({ lock: true }, () => {
            if (
              this.state.studentCount / this.state.studentResultsLength >
              this.state.page
            ) {
              this.setState({ page: this.state.page + 1 }, () => {
                if (storePath.split("&")[0]) {
                  this.orderDetails()
                } else {
                  let appointment_id = storePath.split("&")[1].split("=")[1]
                  this.loadAppointmentData(appointment_id)
                }
              });
            }
          });
        }
      }
    });
  }
  orderDetails = (reset = false) => {
    let list;
    getOrderDetails(data, this.state.page)
      .then((res) => {
        // console.log();
        if (Object.keys(this.state.orderDetail).length !== 0 && !reset) {
          list = this.state.orderDetail.results;
          list.push(...res.data.Data.results);
          res.data.Data.results = list;
          this.setState({ orderDetail: res.data.Data });
        } else {
          this.setState({
            orderDetail: res.data.Data,
            studentResultsLength: res.data.Data.results.length,
            studentCount: res.data.Data.count,
          });
        }
        this.setState({ lock: false });
      })
      .catch((err) => {
        console.log(err.res);
      });
  }
  loadAppointmentData = (id, reset = false) => {
    let list;
    axios
      .get(`/admin/manage_appointments/?store=${id}&date=${this.state.currentDate}&page_no=${this.state.page}`)
      .then((res) => {
        // console.log("orderDetail", res.data.Data);
        if (Object.keys(this.state.orderDetail).length !== 0 && !reset) {
          list = this.state.orderDetail.results;
          list.push(...res.data.Data.results);
          res.data.Data.results = list;
          this.setState({ orderDetail: res.data.Data });
        } else {
          this.setState({
            orderDetail: res.data.Data,
            studentResultsLength: res.data.Data.results.length,
            studentCount: res.data.Data.count,
          });
        }
        this.setState({ lock: false });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  nameTemplate(rowData) {
    return (
      <React.Fragment>
        <img
          alt={rowData.name}
          src={
            rowData?.customer?.profile_image
              ? rowData?.customer?.profile_image
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
        <span>{rowData.customer.name}</span>
      </React.Fragment>
    );
  }
  loadAppointment(rowData) {
    this.props.history.push(`/orderdetails/${rowData.data.id}`);
  }
  render() {
    // console.log('orderDetail', this.state.orderDetail.results);
    const { t } = this.props
    return (
      <div className="orderlist-layout">
        <div className="orderlist-layout-header">
          <div className="buttons">
            <button
              className="btn-navy-circle ms-2"
              onClick={() => this.props.history.goBack()}
              style={{
                width: "30px",
                height: "30px",
              }}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <span>
              <h3> {t(`${title}`)} {title == "Booking" ? null : t('Appointment')}</h3>
            </span>
          </div>
        </div>
        <div className="orderlist-layout-body">
          {/* {
            this.state.studentResultsLength > 0 ? */}
          <DataTable
            value={this.state.orderDetail.results}
            scrollable
            scrollHeight="100%"
            onRowClick={this.loadAppointment}
            emptyMessage={t('No Record Found')}
          >
            <Column
              field="customer.name"
              header={t('customer name')}
              body={this.nameTemplate}
            ></Column>
            <Column field="customer.mobile_no" header={t('Phone Number')}></Column>
            <Column field="customer.email" header={t('Email')}></Column>
            <Column field="appointment_nature" header={t('Booking Type')}></Column>
            <Column field="amount_paid" header={t('Price')}></Column>
          </DataTable>
          {/* :
              <center className="mt-3">{t('No Record Found')}</center>
          } */}
        </div>
      </div>
    );
  }
}
export default withTranslation()(withRouter(OrderList));
