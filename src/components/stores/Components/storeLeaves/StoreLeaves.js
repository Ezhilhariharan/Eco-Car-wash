import { useRouteMatch } from "react-router-dom";
import { withRouter, useHistory } from "react-router";
import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "./styles/StoreLeaves.scss";
import { StoreStaffLeaves } from "../../utils/StoreStaffLeaves";
import axios from "axios";

const StoreLeaves = () => {
  let { url } = useRouteMatch();
  const history = useHistory();
  let [storeLeavesList, setStoreLeavesList] = useState([]);
  let staffLeaves = new StoreStaffLeaves();

  // const storeRedirect = (rowData) => {
  //   history.push(`${url}/viewstore/${rowData.data.id}`);
  // };

  useEffect(() => {
    axios
      .get(`/admin/manage_user_leave/`)
      .then((res) => {
        if (res.data.Status) {
          setStoreLeavesList(res.data.Data)
        } else {
          console.error(res)
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [storeLeavesList === []]);

  return (
    <div className="store-staff-leaves h-100 w-100">
      <div className="d-flex flex-row store-staff-leaves-head w-100">
        <h2>Store Leaves</h2>
      </div>
      <div className="d-flex flex-column store-staff-leaves-body w-100">
        <DataTable value={storeLeavesList} scrollable scrollHeight="100%">
          <Column field="title" header="Title"></Column>
          <Column field="description" header="Description"></Column>
          <Column field="from_date" header="From"></Column>
          <Column field="to_date" header="To"></Column>
          <Column field="days" header="No.of Days"></Column>
          <Column field="approved_by.name" header="Approved By"></Column>
        </DataTable>
      </div>
    </div>
  );
};

export default withRouter(StoreLeaves);
