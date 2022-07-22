import storeIltn1 from "./assets/store_iltn_1.svg";
import React, { useState, useRef } from "react";
import "./styles/CreateStore.scss";
import { withRouter, useHistory } from "react-router";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import axios from "axios";
import { useDispatch } from "react-redux";
import Errormodal from "../../../common_component/errormodal/Errormodal";
import { useTranslation } from 'react-i18next';
import WithTranslateFormErrors from "../../../language/useTranslateFormErrors"

//  this.creationChild = React.createRef(); (value && value.size < 20971520)
const CreateStore = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const [errorMsg, setErrorMsg] = useState("");
  const [filename, setfilename] = useState("");
  const [imgfile, setimgfile] = useState("");
  const Errormodalref = useRef();
  const imageRef = React.useRef()

  let file
  const changeImage = () => {
    console.log("cool");
    file = document.getElementById("image").files[0];
    if (file) {
      if (file.size < 20971520) {
        setimgfile(file)
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
  const selectImage = () => {
    console.log("selectImage", imageRef);
  }
  // console.log("file", imgfile);
  return (
    <div className="create-store-body">
      <div className="add-store">
        <div className="d-flex justify-content-start align-items-center ms-3 mb-3">
          <button className="btn-navy-circle" onClick={() => { history.goBack() }}><i className="fa fa-chevron-left"></i></button>
          <h2 className="ms-3"

          >{t('Create Store')}</h2>
        </div>
        <div className="create-store-form">
          <Formik
            initialValues={{
              name: "",
              email: "",
              mobile_no: "",
              address: "",
              image: "",
            }}
            // validationSchema={validationSchema}
            // .min(3, t('Too Short!'))  
            validationSchema={yup.object().shape({
              name: yup.string().required(t("Name field is required!")).min(3, t('Too Short!')),
              email: yup.string().email(t('Enter Valid email address!')).required(t('Email field is required!')),
              mobile_no: yup.string().test("", t('Enter Valid Mobile no'), (value) =>
                (value + "").match(/^[\d\-\s]{6,18}$/)
              ).required(t('Mobile number field is required!')),
              address: yup.string().required(t('Address field is required!')),
            })}
            onSubmit={(values, onSubmitProps) => {
              // console.log(values);
              // if (imgfile) {
              dispatch({
                type: "Loading",
                loadingState: new Date().getTime(),
              })
              let formData = new FormData();
              formData.append("name", values.name);
              formData.append("email", values.email);
              formData.append("mobile_no", values.mobile_no);
              if (imgfile) {
                formData.append("image", imgfile);
              }
              formData.append("address", values.address);
              axios
                .post("admin/manage_stores/", formData)
                .then((res) => {
                  console.log(res.data);
                  dispatch({
                    type: "Loading",
                    loadingState: new Date().getTime(),
                  })
                  if (res.data.Status) {
                    dispatch({
                      type: "ShowToast", text: "Updated Successfully ",
                      time: new Date().getTime(),
                    });

                    onSubmitProps.resetForm();
                    history.push('/stores')
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
                  // console.log(err.data)
                  if (!error.response.data.Status) {
                    if (error.response.data.hasOwnProperty('Message')) {
                      setErrorMsg(error.response.data.Message)
                      Errormodalref.current.showModal()

                    }
                  }

                })
              // } else {
              //   // console.log("No image ");
              //   setErrorMsg("Update Image")
              //   Errormodalref.current.showModal()
              // }
            }}
          >
            {props => {
              const {
                touched,
                errors,
                setFieldTouched
              } = props;
              return (
                // <WithTranslateFormErrors errors={errors} touched={touched} setFieldTouched={setFieldTouched}>
                <Form id="create_store_form">
                  <div className="row">
                    <div className="col-12 col-sm-12 col-md-6 col-lg-6 mb-5">
                      <label className="label" htmlFor="name"
                      // onClick={() => dispatch({
                      //   type: "Loading",
                      //   loadingState: new Date().getTime(),
                      // })}
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
                      {/* {errors.name && touched.name && (
                        <div className="input-feedback">{errors.name}</div>
                      )} */}
                      <ErrorMessage name="name" className="text-danger">
                        {(msg) => <small className="text-danger">{t(msg)}</small>}
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
                        maxLength={16}
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
                      <div className="d-flex flex-row">
                        <label className="mt-1 choose_file" htmlFor="image" >{t("Choose File")}</label>
                        <Field
                          id="image"
                          name="image"
                          type="file"
                          className="form-control image"
                          // accept="image/jpeg, image/png, image/heic, image/heif, image/jpg"
                          accept="image/*"
                          onChange={changeImage}
                          ref={imageRef}
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
                  <button type="submit" className="btn-navy mx-auto mt-5"> {t('Create')}</button>
                </Form>
                // </WithTranslateFormErrors>
              )
            }}
          </Formik>
        </div>
      </div>

      <div className="d-lg-flex d-none illustration">
        <img src={storeIltn1} />
      </div>
      <Errormodal ref={Errormodalref} message={errorMsg} />
    </div>
  );
};

export default (CreateStore);
