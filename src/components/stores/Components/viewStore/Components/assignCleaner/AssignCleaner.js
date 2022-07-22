import "./styles/AssignCleaner.scss";
import { useState, useEffect } from "react";
import FlatList from "flatlist-react";
import { getCleanerList } from "./api/GET.js";
import { assignStoreCleaner } from "./api/PATCH";
import { useTranslation } from 'react-i18next';

const AssignCleaner = ({ changeMenu, store_id, getStoreCleaners }) => {
  let [cleanerList, setcleanerList] = useState([]);
  let [LocalhasMoreItems, setLocalhasMoreItems] = useState(true);
  // let [isCheckbox, setIsCheckbox] = useState([]);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    getCleanerList(parseInt(store_id))
      .then((res) => {
        console.log(res.data.Data);
        if (res.data.Status) {
          setcleanerList(res.data.Data);
        } else {
          console.error(res)
        }
      })
      .catch((err) => {
        console.log(err);
        return err;
      });
  }, []);

  const submitCleaners = () => {
    let value = document.querySelectorAll("input[name=cleanerassign]:checked");
    let cleaners = [];
    for (let i of value) {
      cleaners.push(i.value);
    }
    assignStoreCleaner({
      store: store_id,
      cleaners: cleaners
    }).then((res) => {
      if (res.data.Status) {
        getStoreCleaners();
        changeMenu(1);
      } else {
        console.log(res.data.Data);
      }
    });
  };
  const fetchfeedsdata = () => {
    console.log("fetchfeedsdata");
  }
  return (
    <div className="assign-manager">
      <div className="manager-head">
        <button className="btn-navy-create" onClick={() => changeMenu(1)}>

          {t('Assign Cleaner')}
        </button>
      </div>

      <div class="card manager-list mt-1">
        <div class="card-body">
          <form>
            {cleanerList
              ? cleanerList.map((cleaner, index) => {
                // console.log("cleaner", cleaner);
                return (

                  <div className="container row mb-3">
                    <div className="profile-picture col-5">
                      <img src={cleaner.profile_image ? cleaner.profile_image : "https://picsum.photos/100"} />
                    </div>
                    <label
                      className="form-check-label col my-auto"
                      for={cleaner.username}
                    >
                      {cleaner.name}
                    </label>
                    <div className="form-check my-auto col-1">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={
                          cleanerList[index]?.store === parseInt(store_id)
                            ? true
                            : false
                        }
                        name="cleanerassign"
                        value={cleaner.username}
                        id={cleaner.username}
                        onChange={(e) => {
                          let cln = [...cleanerList];
                          if (!e.target.checked) {
                            cln[index].store = null;
                          } else {
                            cln[index].store = parseInt(store_id);
                          }
                          setcleanerList(cln);
                        }}
                      />
                    </div>
                  </div>
                )
              }
              )
              : null}
          </form>
        </div>
      </div>
      <button
        className="btn-navy "
        onClick={() => submitCleaners()}
        style={{ height: "4rem" }}
      >
        {t('Submit')}
      </button>
    </div>
  );
};

export default AssignCleaner;
