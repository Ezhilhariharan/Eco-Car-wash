import React, { Component } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { Modal } from "bootstrap";
import { Translation } from 'react-i18next';
import { getAppointmentServiceData, getAllServices } from "../../../api/GET";
import { updateService } from "../../../api/PATCH";
import { deleteService } from "../../../api/DELETE";
import Sliderafter from "../../../../orderdetails/components/sliders/sliderafter/Sliderafter";
import Sliderbefore from "../../../../orderdetails/components/sliders/sliderbefore/Sliderbefore";

import "./styles/EditGarageServices.scss";

const validationSchema = yup.object().shape({
  name: yup.string().required("Name field is required!"),
  email: yup.string().required("Email field is required!"),
  mobile_no: yup.string().required("Mobile No field is required!"),
  description: yup.string().required("Description field is required!"),
});

class EditGarageServices extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allServices: [],
      serviceData: {},
      interiorStandard: [],
      exteriorStandard: [],
      interiorPremium: [],
      exteriorPremium: [],
      editMode: 0,
      afterImage: [],
      beforeImage: [],
    };
    this.modalRef = React.createRef();
    this.loadServiceData = this.loadServiceData.bind(this);
    this.actionTemplate = this.actionTemplate.bind(this);
    this.loadAllServices = this.loadAllServices.bind(this);
  }

  componentDidMount() {
    // console.log(this.props.appointment_id, this.props.editedNumber, this.props.editedTime);
    this.loadServiceData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.editMode === 2 && this.state.allServices.length === 0) {
      this.loadAllServices();
    }
  }

  loadAllServices() {
    getAllServices(this.state.serviceData?.car_type)
      .then((res) => {
        this.setState({ allServices: res.data.Data });
      })
      .catch((err) => console.log(err));
  }

  loadServiceData() {
    getAppointmentServiceData(
      // this.props.appointment_id,
      this.props.editedNumber,
      // this.props.editedTime
    )
      .then((res) => {
        console.log("service data", res.data.Data);
        this.setState({ serviceData: res.data.Data });
        this.setState({
          beforeImage: res.data.Data.images.filter((item) => item.image_type == "Before")
          , afterImage: res.data.Data.images.filter((item) => item.image_type == "After")
        });
        let interiorStandard = [],
          exteriorStandard = [],
          interiorPremium = [],
          exteriorPremium = [];
        res.data.Data.services.forEach((element) => {
          if (
            element.service_type === "Interior" &&
            element.service_nature === "Standard"
          ) {
            interiorStandard.push(element);
          } else if (
            element.service_type === "Interior" &&
            element.service_nature === "Premium"
          ) {
            interiorPremium.push(element);
          } else if (
            element.service_type === "Exterior" &&
            element.service_nature === "Standard"
          ) {
            exteriorStandard.push(element);
          } else if (
            element.service_type === "Exterior" &&
            element.service_nature === "Premium"
          ) {
            exteriorPremium.push(element);
          }
        });
        // console.log(interiorStandard, exteriorStandard, interiorPremium, exteriorPremium);
        this.setState({
          interiorStandard: interiorStandard.filter((thing, index, self) => index === self.findIndex((t) => (t.id === thing.id))),
          exteriorStandard: exteriorStandard.filter((thing, index, self) => index === self.findIndex((t) => (t.id === thing.id))),
          interiorPremium: interiorPremium.filter((thing, index, self) => index === self.findIndex((t) => (t.id === thing.id))),
          exteriorPremium: exteriorPremium.filter((thing, index, self) => index === self.findIndex((t) => (t.id === thing.id))),
        });
      })
      .catch((err) => console.log(err));
  }

  showModal() {
    const modalEle = this.modalRef.current;
    const bsModal = new Modal(modalEle, {
      backdrop: "static",
      keyboard: false,
    });
    bsModal.show();
  }

  hideModal() {
    const modalEle = this.modalRef.current;
    const bsModal = Modal.getInstance(modalEle);
    bsModal.hide();
    this.props.refreshState()
    this.props.refresh(this.props.id)
  }

  actionTemplate(rowData) {
    console.log(rowData);
    return (
      <React.Fragment>
        <i
          className="fas fa-trash"
          onClick={() => {
            if (
              window.confirm("Are you sure you want to delete this service?")
            ) {
              console.log(",,,,a,a", this.state.serviceData);
              let services = [];
              this.state.serviceData.services.forEach(
                (service) => {
                  if (rowData.id == service.id) {

                  } else {
                    services.push(service.id);
                  }
                }
              );
              // services.push(values.service);
              console.log("services", services);
              let data = {
                services: services,
              }
              updateService(this.props.editedNumber, data)
                .then((res) => {
                  // if (res.data.Status) {
                  this.loadServiceData();
                  // }
                })
                .catch((err) => console.log(err));
            }
          }}
        />
      </React.Fragment>
    );
  }

  render() {
    return (
      <Translation>{
        (t, { i18n }) =>
          <div
            className="modal"
            id="createProductModal"
            ref={this.modalRef}
            tabIndex="-1"
          >
            <div className="modal-dialog modal-xl modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{t('Edit Service Details')}</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => this.hideModal()}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body mx-5">
                  <div className="d-flex flex-row justify-content-between">
                    <div className="d-flex flex-column">
                      <div className="garage-appointment-service-data mb-3">
                        <div className="title">{t('Vechicle No')}.</div>
                        <div className="data">
                          {this.state.serviceData?.car_number}
                        </div>
                      </div>
                      <div className="garage-appointment-service-data mb-3">
                        <div className="title">{t('Car Type')}</div>
                        <div className="data">
                          {this.state.serviceData?.car_type}
                        </div>
                      </div>
                    </div>

                    <div className="d-flex flex-column">
                      <div className="garage-appointment-service-data mb-3">
                        <div className="title">{t('Start')}</div>
                        <div className="data">
                          {this.state.serviceData?.start_time}
                        </div>
                      </div>
                      <div className="garage-appointment-service-data mb-3">
                        <div className="title">{t('End')}</div>
                        <div className="data">
                          {this.state.serviceData?.end_time}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-6">
                      <div className="garage-appointment-service-data mb-3">
                        <div className="title w-100">
                          {t('Services Availed')}
                          {
                            this.props.appointmentData?.appointment_status !==
                              "Completed" ? (
                              this.state.editMode === 0 ? (
                                <i
                                  className="fas fa-pen me-3 ms-auto"
                                  onClick={() => this.setState({ editMode: 1 })}
                                ></i>
                              ) : this.state.editMode === 1 ? (
                                <>
                                  <div
                                    className="me-3 ms-auto"
                                    onClick={() => this.setState({ editMode: 0 })}
                                    style={{ cursor: "pointer" }}
                                  >
                                    {t('Done')}
                                  </div>
                                  <i
                                    className="fas fa-plus mt-1"
                                    onClick={() => this.setState({ editMode: 2 })}
                                  ></i>
                                </>
                              ) : this.state.editMode === 2 ? (
                                <div
                                  className="me-3 ms-auto"
                                  onClick={() => this.setState({ editMode: 0 })}
                                  style={{ cursor: "pointer" }}
                                >
                                  {t('Done')}
                                </div>
                              ) : null
                            ) : null
                          }
                        </div>
                        {this.state.editMode === 0 ? (
                          <div className="data" id="listServices">
                            {this.state.interiorStandard.length > 0 ? (
                              <>
                                <div className="heading my-2">
                                  {t('Interior')}
                                  <i
                                    className="fas fa-chevron-right mx-3"
                                    style={{ fontSize: "0.9rem" }}
                                  ></i>
                                  {t('Standard')}
                                </div>
                                {this.state.interiorStandard.map(
                                  (service, index) => {
                                    console.log(service);
                                    // const ids = service.map(o => o.id)
                                    // const filtered = service.filter(({ id }, index) => !ids.includes(id, index + 1))
                                    // console.log(filtered);
                                    return (
                                      <div key={index} className="service-platter">
                                        <div className="service-name">
                                          {service.title}
                                        </div>
                                        <div className="ms-auto me-2">-</div>
                                        <div className="service-price">
                                          {service.price}
                                        </div>
                                      </div>
                                    );
                                  }
                                )}
                              </>
                            ) : null}
                            {this.state.interiorPremium.length > 0 ? (
                              <>
                                <div className="heading my-2">
                                  {t('Interior')}
                                  <i
                                    className="fas fa-chevron-right mx-3"
                                    style={{ fontSize: "0.9rem" }}
                                  ></i>
                                  {t('Premium')}
                                </div>
                                {this.state.interiorPremium.map(
                                  (service, index) => {
                                    return (
                                      <div key={index} className="service-platter">
                                        <div className="service-name">
                                          {service.title}
                                        </div>
                                        <div className="ms-auto me-2">-</div>
                                        <div className="service-price">
                                          {service.price}
                                        </div>
                                      </div>
                                    );
                                  }
                                )}
                              </>
                            ) : null}
                            {this.state.exteriorStandard.length > 0 ? (
                              <>
                                <div className="heading my-2">
                                  {t('Exterior')}
                                  <i
                                    className="fas fa-chevron-right mx-3"
                                    style={{ fontSize: "0.9rem" }}
                                  ></i>
                                  {t('Standard')}
                                </div>
                                {this.state.exteriorStandard.map(
                                  (service, index) => {
                                    return (
                                      <div key={index} className="service-platter">
                                        <div className="service-name">
                                          {service.title}
                                        </div>
                                        <div className="ms-auto me-2">-</div>
                                        <div className="service-price">
                                          {service.price}
                                        </div>
                                      </div>
                                    );
                                  }
                                )}
                              </>
                            ) : null}
                            {this.state.exteriorPremium.length > 0 ? (
                              <>
                                <div className="heading my-2">
                                  {t('Exterior')}
                                  <i
                                    className="fas fa-chevron-right mx-3"
                                    style={{ fontSize: "0.9rem" }}
                                  ></i>
                                  {t('Premium')}
                                </div>
                                {this.state.exteriorPremium.map(
                                  (service, index) => {
                                    return (
                                      <div key={index} className="service-platter">
                                        <div className="service-name">
                                          {service.title}
                                        </div>
                                        <div className="ms-auto me-2">-</div>
                                        <div className="service-price">
                                          {service.price}
                                        </div>
                                      </div>
                                    );
                                  }
                                )}
                              </>
                            ) : null}
                          </div>
                        ) : this.state.editMode === 1 ? (
                          <div
                            className="data"
                            id="editServices"
                            style={{
                              height: "50vh",
                              maxHeight: "unset",
                              overflow: "unset",
                            }}
                          >
                            <DataTable
                              value={this.state.serviceData?.services.filter((thing, index, self) => index === self.findIndex((t) => (t.id === thing.id)))}
                              scrollable
                              scrollHeight="100%"
                            >
                              <Column field="title" header={t('Title')}></Column>
                              <Column
                                field="service_type"
                                header={t('Service Type')}
                              ></Column>
                              <Column
                                field="service_nature"
                                header={t('Service Nature')}
                              ></Column>
                              <Column
                                field="price"
                                header={t('Cost')}
                              ></Column>
                              <Column
                                field="id"
                                header={t('Action')}
                                body={this.actionTemplate}
                              ></Column>
                            </DataTable>
                          </div>
                        ) : (
                          <div
                            style={{
                              height: "50vh",
                              maxHeight: "unset",
                              overflow: "unset",
                            }}
                          >
                            <Formik
                              initialValues={{
                                service: "",
                              }}
                              // validationSchema={validationSchema}
                              onSubmit={(values, onSubmitProps) => {
                                console.log(values);
                                let services = [];
                                this.state.serviceData.services.forEach(
                                  (service) => {
                                    services.push(service.id);
                                  }
                                );
                                services.push(values.service);
                                console.log("services", services);
                                let data = {
                                  services: services,
                                  // car_number: this.state.serviceData.car_number,
                                  // start_time: this.state.serviceData.start_time,
                                };
                                updateService(this.props.editedNumber, data).then(
                                  (res) => {
                                    console.log(res);
                                    this.loadServiceData()
                                    onSubmitProps.resetForm();
                                    this.setState({ editMode: 0 })
                                    // this.hideModal();
                                  },
                                  (err) => {
                                    console.log(err);
                                  }
                                );
                              }}
                            >
                              <Form id="serviceForm" className="py-4 h-100 w-75">
                                {/* <div className="form-check">
                                  <input className="form-check-input" type="checkbox" value="" id="flexCheckChecked" checked>
                                    <label className="form-check-label" for="flexCheckChecked">
                                      Checked checkbox
                                    </label>
                                </div> */}

                                {/* <div 
                                  className="service-holder mb-3"
                                  style={{ height: "85%", overflowY: "scroll" }}
                                >
                                  {
                                    this.state.allServices.map((service, index) => {
                                      // console.log(service);
                                      return (
                                        <div className="form-check" key={index}>
                                          <Field
                                            id={`services_${index}`}
                                            name="services"
                                            type="checkbox"
                                            className="form-check-input"
                                            checked={false}
                                          />
                                          <label 
                                            className="form-check-label" 
                                            htmlFor={`services_${index}`}
                                          >
                                            {service.title} - {service.price}
                                          </label>
                                        </div>
                                      )
                                    })
                                  }
                                </div> */}
                                <div className="mb-3">
                                  <label className="label" htmlFor="name">
                                    {t('Service')}
                                  </label>
                                  <Field
                                    id="name"
                                    name="service"
                                    as="select"
                                    className="form-control"
                                  >
                                    <option value="">Select Service</option>
                                    {this.state.allServices.map(
                                      (service, index) => {
                                        return (
                                          <option key={index} value={service.id}>
                                            {service.title} - {service.price}
                                          </option>
                                        );
                                      }
                                    )}
                                  </Field>
                                  <div className="text-danger">
                                    <ErrorMessage name="name" />
                                  </div>
                                </div>
                                <button className="btn-navy mx-auto" type="submit">
                                  {t('Create')}
                                </button>
                              </Form>
                            </Formik>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-6 service-image-container-layout">
                      <div className="d-flex flex-row" style={{ width: "80%" }}>
                        {t('Before')}
                      </div>
                      <Sliderbefore images={this.state.beforeImage} />
                      {/* <div className="service-image-container">
                        <img src="http://picsum.photos/200" alt="" />
                        <img src="http://picsum.photos/200" alt="" />
                        <img src="http://picsum.photos/200" alt="" />
                        <img src="http://picsum.photos/200" alt="" />
                        <img src="http://picsum.photos/200" alt="" />
                        <img src="http://picsum.photos/200" alt="" />
                        <img src="http://picsum.photos/200" alt="" />
                      </div> */}
                      <div className="d-flex flex-row" style={{ width: "80%" }}>
                        {t('After')}
                      </div>
                      <Sliderafter images={this.state.afterImage} />
                      {/* <div className="service-image-container">
                        <img src="http://picsum.photos/201" alt="" />
                        <img src="http://picsum.photos/201" alt="" />
                        <img src="http://picsum.photos/201" alt="" />
                        <img src="http://picsum.photos/201" alt="" />
                        <img src="http://picsum.photos/201" alt="" />
                        <img src="http://picsum.photos/201" alt="" />
                        <img src="http://picsum.photos/201" alt="" />
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      }
      </Translation>
    );
  }
}
export default EditGarageServices;
