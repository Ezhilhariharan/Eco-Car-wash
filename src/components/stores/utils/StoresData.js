import React from "react";
import { withTranslation } from 'react-i18next';
import { useTranslation } from 'react-i18next';
import { Translation } from 'react-i18next';

export class StoresData {
  nameTemplate(rowData) {
    return (
      <React.Fragment>
        <img
          alt={rowData.name}
          src={
            rowData.image
              ? rowData.image
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
        <span>{rowData.name}</span>
      </React.Fragment>
    );
  }

  leaveTemplate(rowData) {
    return (
      <React.Fragment>
        <Translation>{
          (t, { i18n }) =>
            <div className="d-flex flex-column align-items-center">
              <span className="row">{t('No. of orders')}</span>
              <span className="row" style={{ fontSize: "40px" }}>
                {rowData.totalapps}
              </span>
            </div>
        }
        </Translation>
      </React.Fragment>

    );
  }

  orderTemplate(rowData) {
    return (
      <React.Fragment>
        <Translation>{
          (t, { i18n }) =>
            <div className="d-flex flex-column align-items-center">
              <span className="row">{t('No. of orders')}</span>
              <span className="row" style={{ fontSize: "40px" }}>
                {rowData.todaysapps}
              </span>
            </div>
        }
        </Translation>
      </React.Fragment>
    );
  }

  phoneTemplate(rowData) {
    return (
      <React.Fragment>
        <div className="d-flex flex-column align-items-center">
          <span>
            <i className="fas fa-phone-alt"></i>&nbsp; {rowData.mobile_no}
          </span>
        </div>
      </React.Fragment>
    );
  }

  emailTemplate(rowData) {
    return (
      <React.Fragment>
        <div className="d-flex flex-column align-items-center">
          <span>
            <i className="far fa-envelope"></i>&nbsp; {rowData.email}
          </span>
        </div>
      </React.Fragment>
    );
  }
}

