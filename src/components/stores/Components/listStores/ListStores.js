import "./styles/ListStores.scss";
import { NavLink, useRouteMatch } from "react-router-dom";
import React, { useEffect, useState, useRef } from "react";
import { withRouter, useHistory } from "react-router";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import axios from "axios";
import { StoresData } from "../../utils/StoresData";
import { useDispatch, useSelector } from "react-redux";
import Errormodal from "../../../common_component/errormodal/Errormodal";
import { useTranslation } from 'react-i18next';

const ListStores = () => {
  const { t, i18n } = useTranslation();
  let [storesList, setStoresList] = useState([]);
  let [searchValue, setsearchValue] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  let { url } = useRouteMatch();
  const dispatch = useDispatch();
  const searchFeild = useSelector((state) => state.menu.searchFeild);
  console.log("selector", searchFeild);
  const history = useHistory();
  const Errormodalref = useRef();

  let store = new StoresData()

  // console.log("List store url:", url)
  const storeRedirect = (rowData) => {
    console.log(rowData);
    history.push(`${url}/${rowData.id}`)
  }

  useEffect(() => {
    dispatch({
      type: "SEARCH_BAR"
    });
    initialUpdate()
    return () => {
      dispatch({
        type: "SEARCH_BAR"
      });
    }
  }, [storesList === []]);

  useEffect(() => {
    // setStoresList([]);
    // setsearchValue(searchFeild)
    initialUpdate(searchFeild)
  }, [searchFeild])

  const initialUpdate = (searchValue) => {
    let Params = {};
    if (searchValue !== "") {
      Params = { name: searchValue };
    }
    axios
      .get(`/admin/manage_stores/`, { params: { search: JSON.stringify(Params) } })
      .then((res) => {
        // console.log(res);
        if (res.data.Status) {
          setStoresList(res.data.Data);
        } else {
          console.error(res)
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  const deleteStore = (rowData) => {
    if (window.confirm("Do you want to delete this leave ")) {
      axios
        .delete(`/admin/manage_stores/${rowData.id}/`)
        .then((res) => {
          console.log("delete", res);
          if (res.data.Status) {
            initialUpdate()
          } else {
            setErrorMsg(res.data.Message)
            Errormodalref.current.showModal()
            console.error(res)
          }
        })
        .catch((error) => {
          if (!error.response.data.Status) {
            if (error.response.data.hasOwnProperty('Message')) {
              setErrorMsg(error.response.data.Message)
              Errormodalref.current.showModal()
            }
          }
        });
    }
  }
  const deleteTemplate = (rowData) => {
    return (
      <>
        <i class="fa-regular fa-trash-can" style={{
          fontSize: "1.2em",
        }}
          onClick={() => deleteStore(rowData)}></i>
        <button
          className="btn-navy-circle ms-5"
          onClick={() => storeRedirect(rowData)}
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            fontSize: "1.5em",
          }}
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </>
    )
  }

  // console.log("searchValue", searchValue);
  return (
    <div className="list-stores">
      <div className="list-stores-head">
        <h3>{t('Physical Stores')}</h3>
        <NavLink
          to={`${url}/createstore`}
          className="btn-navy"
        >
          {t('create store')}
        </NavLink>
      </div>
      <div className="list-stores-body">
        {
          storesList.length > 0 ?
            <DataTable value={storesList} scrollable scrollHeight="100%">
              <Column field="name" header={t('Name')} body={store.nameTemplate} ></Column>
              <Column field="mobile_no" header={t('mobile no')} body={store.phoneTemplate}></Column>
              <Column field="email" header={t('email')} body={store.emailTemplate}></Column>
              <Column field="leave" header={t('Total Appointments')} body={store.leaveTemplate}></Column>
              <Column field="orders" header={t('Todays Appointments')} body={store.orderTemplate}></Column>
              <Column field="action" header={t('Action')} body={deleteTemplate}></Column>
            </DataTable>
            :
            <center className="mt-3">{t('No Record Found')}</center>
        }
      </div>
      <Errormodal ref={Errormodalref} message={errorMsg} />
    </div>
  );
};

export default withRouter(ListStores);
