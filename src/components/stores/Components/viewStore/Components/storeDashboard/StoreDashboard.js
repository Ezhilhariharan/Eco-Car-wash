import { Component } from "react";
import { NavLink } from "react-router-dom";
import { withRouter } from "react-router";
import StoreMenu from "../storeMenu/StoreMenu";
import AssignManager from "../assignManager/AssignManager";
import AssignCleaner from "../assignCleaner/AssignCleaner";
import ServiceType from "../serviceType/ServiceType";
import axios from "axios";
import ScaleText from "react-scale-text";
import { withTranslation } from 'react-i18next';
import Ecologo from '../../../../../../assets/ecologo.svg';

import "./styles/StoreDashboard.scss";

let url, store_id, leave_url;

class ViewStore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuSelected: 1,
      storeDetails: [],
      storeManager: "",
      storeCleaners: [],
    };
    this.changeMenu = this.changeMenu.bind(this);
    url = this.props.match.path;
    store_id = this.props.match.params.id;
    leave_url = url.split("/");
    leave_url.pop();
    leave_url = leave_url.join("/");
    this.getStoreManager = this.getStoreManager.bind(this);
    this.getStoreCleaners = this.getStoreCleaners.bind(this);
  }

  changeMenu(value) {
    this.setState({ menuSelected: value });
  }

  getStore() {
    axios
      .get(`/admin/manage_stores/${store_id}/`)
      .then((res) => {
        console.log("storeDetails", res.data.Data);
        if (res.data.Status) {
          this.setState({ storeDetails: res.data.Data });
        } else {
          console.error(res);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getStoreManager() {
    axios
      .get(`/admin/manage_staff/?user_type=2&store=${store_id}`)
      .then((res) => {
        if (res.data.Status) {
          this.setState({ storeManager: res.data.Data[0].name });
        } else {
          console.error(res);
        }
      })
      .catch((err) => {
        this.setState({ storeManager: "No Manager" });
      });
  }

  getStoreCleaners() {
    axios
      .get(`/admin/manage_staff/?user_type=3&store=${store_id}`)
      .then((res) => {
        if (res.data.Status) {
          this.setState({ storeCleaners: res.data.Data });
        } else {
          console.error(res);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  componentDidMount() {
    this.getStore();
    this.getStoreManager();
    this.getStoreCleaners();
  }

  render() {
    // console.log("this.state.storeDetails", this.state.storeDetails);
    const { t } = this.props
    return (
      <div className="view-store-section">
        <div className="view-store-dashboard">
          <div class="row dashboard-top-section">
            <div class="card h-100 w-100">
              <div class="card-body d-flex flex-row h-100 w-100">
                <div className="buttons-navigate d-flex flex-row">
                  <button className="btn-navy-circle" onClick={() => this.props.history.goBack()}>
                    <i className="fa fa-chevron-left"></i>
                  </button>
                  <button className="btn-navy-edit" onClick={() => this.props.history.push(`/stores/${store_id}/editstore`)}>
                    <i class="fa-solid fa-pen"></i>
                  </button>
                </div>
                <div
                  // style={{ width: "30%" }}
                  className="d-flex flex-column justify-content-center align-items-center  store-proDetails"
                >
                  <div className="profile-picture mb-3">
                    <img src={this.state.storeDetails.image ? this.state.storeDetails.image
                      : `https://avatars.dicebear.com/api/initials/${this.state.storeDetails.name}.svg`} />
                  </div>
                  <h5 className="mb-3 " style={{ fontWeight: "700", }}>{this.state.storeDetails.name}</h5>
                  <h6 style={{ fontWeight: "700", color: "#63666A" }} >{this.state.storeDetails?.address?.address}</h6>
                </div>
                <div
                  style={{ width: "34%" }}
                  className="d-flex flex-column justify-content-between align-items-center h-100 p-2"
                >
                  <div className="d-flex flex-row card w-100">
                    <div className="card-body h-100 dashboard-store-manager-card w-100">
                      <h6 className="mint">{t('Manager')}</h6>
                      <p className="wrap-text" title={this.state.storeManager}>{this.state.storeManager}</p>
                    </div>
                  </div>
                  <div className="d-flex flex-column p-3 w-100">

                    <h6 style={{ fontWeight: "700", color: "#63666A" }}>{t('Phone')}</h6>
                    <p>{this.state.storeDetails.mobile_no}</p>
                    <h6 className="" style={{ fontWeight: "700", color: "#63666A" }}>{t('Email')}</h6>
                    <p>{this.state.storeDetails.email}</p>
                  </div>
                </div>
                <div
                  style={{ width: "36%" }}
                  className="d-flex flex-column justify-content-center align-items-center h-100 p-2"
                >
                  <div className="card w-100 h-100">
                    <div className="card-body w-100 h-100 dashboard-store-manager-card">
                      <h6 className="mint">{t('Cleaners')}</h6>
                      <div className="dashboard-store-cleaner-card">
                        {this.state.storeCleaners.length === 0 ? (
                          <p>{t('No Cleaners')}</p>
                        ) : (
                          this.state.storeCleaners.map((data, index) => {
                            return <p key={index}>{data.name}</p>;
                          })
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row dashboard-bottom-section pt-4">
            <div className="col-4 store-appointment-card ps-0">
              <NavLink
                style={{ textDecoration: "none", color: "#000" }}
                to={`/orderdetails?status=Completed&store=${store_id}`}
              >
                <div className="card">
                  <div className="card-body d-flex flex-column align-items-center">
                    <div className="d-flex flex-row justify-content-center cards_back w-100">
                      <h5>{t('completed appointments')}</h5>
                    </div>
                    <div className="h-75 w-100 text-center d-flex align-items-center justify-content-center">
                      <ScaleText widthOnly={true} maxFontSize={80} className="d-flex align-items-center justify-content-center">
                        <p className="my-auto mint">
                          {this.state.storeDetails.completedapps}
                        </p>
                      </ScaleText>
                    </div>
                  </div>
                </div>
              </NavLink>
            </div>
            <div className="col-4">
              <NavLink
                style={{ textDecoration: "none", color: "#000" }}
                to={`/stores/appointments/status=Today&store=${store_id}`}

              >
                <div className="card">
                  <div className="card-body d-flex flex-column h-100 align-items-center">
                    <div className="d-flex flex-row justify-content-center cards_back w-100">
                      <h5>{t('Today Appointments')}</h5>
                    </div>
                    <div className="h-75 w-100 text-center d-flex align-items-center justify-content-center">
                      <ScaleText widthOnly={true} maxFontSize={80} className="d-flex align-items-center justify-content-center">
                        <p className="my-auto mint" title={this.state.storeDetails.todaysapps}>
                          {this.state.storeDetails.todaysapps}
                        </p>
                      </ScaleText>
                    </div>
                  </div>
                </div>
              </NavLink>
            </div>
            <div className="col-4 pe-0">
              <NavLink
                style={{ textDecoration: "none", color: "#000" }}
                to={`/stores/appointments/status=Upcoming&store=${store_id}`}

              >
                <div className="card">
                  <div className="card-body d-flex flex-column align-items-center">
                    {/* cards_back */}
                    <div className="d-flex flex-row justify-content-center cards_back w-100">
                      <h5>{t('Upcoming Appointments')}</h5>
                    </div>
                    <div className="h-75 w-100 text-center d-flex align-items-center justify-content-center">
                      <ScaleText widthOnly={true} maxFontSize={80} className="d-flex align-items-center justify-content-center">
                        <p className="my-auto mint" >
                          {this.state.storeDetails.upcomingapps}
                        </p>
                      </ScaleText>
                    </div>
                  </div>
                </div>
              </NavLink>
            </div>
          </div>
        </div>
        <div
          style={{ textDecoration: "none", color: "#000" }}
          className="view-store-body"
        >
          {this.state.menuSelected === 1 && (
            <StoreMenu changeMenu={this.changeMenu} forUserReview={store_id} />
          )}
          {this.state.menuSelected === 2 && (
            <AssignManager
              changeMenu={this.changeMenu}
              store_id={store_id}
              getStoreManager={this.getStoreManager}
            />
          )}
          {this.state.menuSelected === 3 && (
            <AssignCleaner
              changeMenu={this.changeMenu}
              store_id={store_id}
              getStoreCleaners={this.getStoreCleaners}
            />
          )}
          {this.state.menuSelected === 4 && (
            <ServiceType changeMenu={this.changeMenu} store_id={store_id} />
          )}
        </div>
      </div>
    );
  }
}

export default withTranslation()(withRouter(ViewStore));
