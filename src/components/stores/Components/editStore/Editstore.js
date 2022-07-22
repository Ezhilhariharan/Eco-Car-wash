import storeIltn1 from "../createStore/assets/store_iltn_1.svg";
import React, { useState, useRef, useEffect } from "react";
import "../createStore/styles/CreateStore.scss";
import { withRouter, useHistory, useLocation, useParams } from "react-router";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import axios from "axios";
import { useDispatch } from "react-redux";
import Errormodal from "../../../common_component/errormodal/Errormodal";
import { useTranslation } from 'react-i18next';

let file
function Editstore() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  let { id } = useParams();
  let [storesList, setStoresList] = useState({});
  let [name, setName] = useState("");
  let [email, setEmail] = useState("");
  let [mobile_no, setMobile_no] = useState("");
  let [address, setAddress] = useState("");
  let [image, setImage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [filename, setfilename] = useState("");
  const Errormodalref = useRef();
  // console.log("Editstore", id);
  useEffect(() => {
    axios
      .get(`/admin/manage_stores/${id}/`)
      .then((res) => {
        if (res.data.Status) {
          console.log("Editstore", res);
          setStoresList(res.data.Data);
          setName(res.data.Data.name)
          setEmail(res.data.Data.email)
          setMobile_no(res.data.Data.mobile_no)
          setAddress(res.data.Data.address)
          setImage(res.data.Data.image)
          setfilename(res.data.Data.image)
        } else {
          console.error(res)
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [storesList === {}]);


  const validationSchema = yup.object().shape({
    name: yup.string().required(t("Name field is required!")).min(3, t('Too Short!')),
    email: yup.string().email("Enter Valid email address!").required("Email field is required!"),
    mobile_no: yup.string().test("", "Enter Valid Mobile no", (value) =>
      (value + "").match(/^[\d\-\s]{6,18}$/)
    ).required("Mobile number field is required!"),
    address: yup.string().required("Address field is required!"),
  });

  const changeImage = () => {
    file = document.getElementById("image").files[0];
    if (file) {
      if (file.size < 20971520) {
        setfilename(file.name)
        var reader = new FileReader();
        reader.onload = () => {

        };
        reader.readAsDataURL(file);
      } else {
        setfilename("")
        setErrorMsg("Size Limit Exceeds")
        Errormodalref.current.showModal()
      }
    }
  }
  // name: storesList.name,
  //             email: storesList.email,
  //             mobile_no: storesList.mobile_no,
  //             address: storesList.address,
  //             image: storesList.image,
  // console.log("image", image);
  return (
    <div className="create-store-body">
      <div className="add-store">
        <div className="d-flex justify-content-start align-items-center ms-3 mb-3">
          <button className="btn-navy-circle" onClick={() => { history.goBack() }}><i className="fa fa-chevron-left"></i></button>
          <h2 className="ms-3"> {t('Edit Store')}</h2>
        </div>
        <div className="create-store-form">
          <Formik
            initialValues={{
              name: name,
              email: email,
              mobile_no: mobile_no,
              address: address.address,
              image: "",
            }}
            enableReinitialize={true}
            // validationSchema={validationSchema}
            validationSchema={yup.object().shape({
              name: yup.string().required(t("required!")),
              email: yup.string().email(t('Enter Valid email address!')).required(t('Email field is required!')),
              mobile_no: yup.string().test("", t('Enter Valid Mobile no'), (value) =>
                (value + "").match(/^[\d\-\s]{6,18}$/)
              ).required(t('Mobile number field is required!')),
              address: yup.string().required(t('Address field is required!')),
            })}
            onSubmit={(values, onSubmitProps) => {
              console.log(values);
              dispatch({
                type: "Loading",
                loadingState: new Date().getTime(),
              })
              let formData = new FormData();
              formData.append("name", values.name);
              formData.append("email", values.email);
              formData.append("mobile_no", values.mobile_no);
              if (file) {
                formData.append("image", file);
                // console.log("image from gallery");
              } else {
                formData.append("image", image);
              }
              formData.append("address", values.address);
              axios
                .patch(`admin/manage_stores/${id}/`, formData)
                .then((res) => {
                  console.log(res.data);
                  if (res.data.Status) {
                    dispatch({
                      type: "Loading",
                      loadingState: new Date().getTime(),
                    })
                    dispatch({
                      type: "ShowToast", text: "Updated Successfully ",
                      time: new Date().getTime(),
                    });
                    onSubmitProps.resetForm();
                    history.goBack()
                  } else {
                    console.error(res)
                    setErrorMsg(res.data.Message)
                    Errormodalref.current.showModal()
                  }
                })
                .catch((error) => {
                  dispatch({
                    type: "Loading",
                    loadingState: new Date().getTime(),
                  })
                  console.log(error.data)
                  if (!error.response.data.Status) {
                    if (error.response.data.hasOwnProperty('Message')) {
                      setErrorMsg(error.response.data.Message)
                      Errormodalref.current.showModal()

                    }
                  }
                }
                );

            }}
          >
            <Form id="create_store_form">
              <div className="row">
                <div className="col-12 col-sm-12 col-md-6 col-lg-6 mb-5">
                  <label className="label" htmlFor="name"

                  >
                    {t('Store Name')}
                  </label>
                  <Field
                    id="name"
                    name="name"
                    type="text"
                    maxLength={25}
                    className="form-control"
                  />
                  <ErrorMessage name="name" className="text-danger">
                    {(msg) => <small className="text-danger">{msg}</small>}
                  </ErrorMessage>
                </div>
                <div className="col-12 col-sm-12 col-md-6 col-lg-6 mb-5">
                  <label className="label" htmlFor="email">
                    {t('Email')}
                  </label>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    className="form-control"
                  />
                  <ErrorMessage name="email">
                    {(msg) => <small className="text-danger">{msg}</small>}
                  </ErrorMessage>
                </div>
              </div>

              <div className="row">
                <div className="col-12 col-sm-12 col-md-6 col-lg-6 mb-5">
                  <label className="label" htmlFor="mobile_no">
                    {t('Phone Number')}
                  </label>
                  <Field
                    id="mobile_no"
                    name="mobile_no"
                    type="text"
                    className="form-control"
                  />
                  <ErrorMessage name="mobile_no">
                    {(msg) => <small className="text-danger">{msg}</small>}
                  </ErrorMessage>
                </div>
                <div className="col-12 col-sm-12 col-md-6 col-lg-6 mb-5">
                  <label className="label" htmlFor="image">
                    {t('Image')}
                  </label>
                  <div className="d-flex flex-row image_name">
                    <label className="mt-1 choose_file" htmlFor="image" >{t("Choose File")}</label>
                    <Field
                      id="image"
                      name="image"
                      type="file"
                      className="form-control image"
                      // accept="image/jpeg, image/png, image/heic, image/heif, image/jpg"
                      accept="image/*"
                      onChange={changeImage}
                      style={{ "display": "none" }}
                    />
                    <div className="ms-1 mt-2">
                      {
                        filename ? filename : t('Select File')
                      }
                    </div>
                  </div>
                  <ErrorMessage name="image">
                    {(msg) => <small className="text-danger">{msg}</small>}
                  </ErrorMessage>
                </div>
              </div>

              <div className="mb-5">
                <label className="label" htmlFor="address">
                  {t('Address')}
                </label>
                <Field
                  id="address"
                  name="address"
                  as="textarea"
                  rows="3"
                  maxLength={200}
                  className="form-control"
                />
                <ErrorMessage name="address">
                  {(msg) => <small className="text-danger">{msg}</small>}
                </ErrorMessage>
              </div>
              <button type="submit" className="btn-navy mx-auto mt-5"> {t('Update')}</button>
            </Form>
          </Formik>
        </div>
      </div>
      <div className="d-lg-flex d-none illustration">
        <img src={storeIltn1} />
      </div>
      <Errormodal ref={Errormodalref} message={errorMsg} />
    </div>
  )
}
export default Editstore;

// export default Editstore