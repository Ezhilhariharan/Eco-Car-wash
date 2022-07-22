import "./styles/AssignManager.scss";
import { useState, useEffect } from "react";
import { getManagerList } from "./api/GET.js";
import { assignStoreManager } from "./api/PATCH";
import { useTranslation } from 'react-i18next';

const AssignManager = ({ changeMenu, store_id, getStoreManager }) => {
  const [managerList, setManagerList] = useState([]);
  let [radioValue, setRadioValue] = useState("");
  const { t, i18n } = useTranslation();
  useEffect(() => {
    getManagerList(store_id)
      .then((res) => {
        console.log("manager list", res.data.Data);
        if (res.data.Status) {
          setManagerList(res.data.Data);
        } else {
          console.error(res)
        }
      })
      .catch((err) => {
        console.log(err);
        return err;
      });
  }, []);

  useEffect(() => { }, [radioValue]);

  const submitManager = () => {
    console.log("radioValue", store_id);
    assignStoreManager(radioValue, { store: parseInt(store_id) }).then((res) => {
      console.log("AssignManager", res.data.Data);
      if (res.data.Status) {
        getStoreManager()
        changeMenu(1)
      } else {
        console.error(res)
      }
    })
      .catch((err) => {
        console.log(err);
        return err;
      });
  };

  return (
    <div className="assign-manager">
      <div className="manager-head">
        <button className="btn-navy-create" onClick={() => changeMenu(1)}>
          {t('Assign Manager')}
        </button>
      </div>
      <div class="card manager-list mt-1">
        <div class="card-body">
          <form>
            {managerList
              ? managerList.map((manager, index) => {
                return (
                  <div
                    className="container row mb-3"
                    onClick={(e) => {
                      setRadioValue(manager.username);
                    }}
                    key={index}
                  >
                    <div className="profile-picture col-5">
                      <img src={manager.profile_image ? manager.profile_image : "https://picsum.photos/100"} />
                    </div>
                    <label
                      className="form-check-label col my-auto"
                      for="managerassign"
                    >
                      {manager.name}
                    </label>
                    <div className="form-check my-auto col-1">
                      <input
                        className="form-check-input"
                        type="radio"
                        checked={radioValue === manager.username ? true : false}
                        value={manager.username}
                        name="managerassign"
                      />
                      {console.log("isChecked", radioValue)}
                    </div>
                  </div>
                );
              })
              : null}

          </form>
        </div>
      </div>
      <button className="btn-navy " onClick={() => submitManager()} style={{ height: '4rem' }}>{t('Submit')}</button>
    </div>
  );
};

export default AssignManager;
