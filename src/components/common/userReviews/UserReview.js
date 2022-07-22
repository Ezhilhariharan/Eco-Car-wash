import React, { Component } from 'react'
import { getCustomerRating } from "./../../customer/api/GET";
import { patchCustomer } from "./../../customer/components/viewcustomer/api/PATCH";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { getFeedBack } from "./../../dashboard/api/Api"
import { withRouter } from "react-router-dom";
import axios from "axios";
import { withTranslation } from 'react-i18next';

let url
export class UserReview extends Component {
    constructor(props) {
        super(props)
        this.state = {
            page: 1,
            lock: true,
            List: {},
        };
        url = this.props.URL
        console.log("url", url)
        this.scrollLoader = this.scrollLoader.bind(this);
        this.getReviewList = this.getReviewList.bind(this);
        this.FeedBack = this.FeedBack.bind(this);
    }
    componentDidMount() {
        this.scrollLoader();
        console.log("this.props.ID", this.props.ID)
        if (url == "dashboard") {
            this.FeedBack()
        } else if (this.props.Cleaner_id) {
            this.getCleanerReview();
        } else if (this.props.ID) {
            this.getStoreReview()
        } else {
            this.getReviewList();
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
                if (!this.state.lock && this.state.List.next) {
                    this.setState({ lock: true }, () => {
                        this.setState({ page: this.state.page + 1 }, () => {
                            this.getReviewList();
                        });
                    });
                }
            }
        });
    }
    getStoreReview(reset = false) {
        axios
            .get(`/admin/manage_stores/get_store_review/?store_id=${this.props.ID}`)
            .then((res) => {
                console.log("this is getStoreReview", res.data.Data);
                if (res.data.Status) {
                    console.log('Cleaner List', res.data.Data, reset);
                    if (Object.keys(this.state.List).length != 0 && !reset) {
                        let List = this.state.List.results;
                        List.push(...res.data.Data.results);
                        res.data.Data.results = List;
                        this.setState({ List: res.data.Data });
                    } else {
                        this.setState({ List: res.data.Data });
                    }
                    this.setState({ lock: false });
                } else {
                    console.error(res)
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }
    getCleanerReview(reset = false) {
        axios
            .get(`/admin/manage_ratings/?cleaner=${this.props.Cleaner_id}`)
            .then((res) => {
                console.log("this is reviews", res.data.Data);
                if (res.data.Status) {
                    console.log('Cleaner List', res.data.Data, reset);
                    if (Object.keys(this.state.List).length != 0 && !reset) {
                        let List = this.state.List.results;
                        List.push(...res.data.Data.results);
                        res.data.Data.results = List;
                        this.setState({ List: res.data.Data });
                    } else {
                        this.setState({ List: res.data.Data });
                    }
                    this.setState({ lock: false });
                } else {
                    console.error(res)
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }
    FeedBack(reset = false) {
        getFeedBack(this.state.page)
            .then((res) => {
                console.log("feedBack", res);
                if (res.data.Status) {
                    console.log('Cleaner List', res.data.Data, reset);
                    if (Object.keys(this.state.List).length != 0 && !reset) {
                        let List = this.state.List.results;
                        List.push(...res.data.Data.results);
                        res.data.Data.results = List;
                        this.setState({ List: res.data.Data });
                    } else {
                        this.setState({ List: res.data.Data });
                    }
                    this.setState({ lock: false });
                } else {
                    console.error(res)
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }
    getReviewList(reset = false) {
        getCustomerRating(this.props.id, this.state.page)
            .then((res) => {
                if (res.data.Status) {
                    // console.log('Cleaner List', res.data.Data, reset);
                    if (Object.keys(this.state.List).length != 0 && !reset) {
                        let List = this.state.List.results;
                        List.push(...res.data.Data.results);
                        res.data.Data.results = List;
                        // console.log(res.data.Data);
                        this.setState({ List: res.data.Data });
                    } else {
                        this.setState({ List: res.data.Data });
                    }
                    this.setState({ lock: false });
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }
    Profile = (rowData) => {
        // console.log("rowData", rowData);
        return (
            <div className="w-100 h-100 ">
                <div className="profile-column d-flex flex-row w-100" >
                    <div className="mt-2 customer-profile-picture ">
                        <img src={rowData.user.profile_image ? rowData.user.profile_image : "https://picsum.photos/100"} alt={rowData.user.name} />
                    </div>
                    <div className="ms-2">
                        <div className=" ">
                            {rowData.user.name}
                        </div>
                        <div className="">
                            {this.StarComponent(rowData.rating)}
                        </div>
                    </div>
                </div>
                <p className="mt-1">
                    {rowData.review}
                </p>
            </div>
        )
    }
    button = (rowData) => {
        const { t } = this.props
        let i = this.state.List.results.indexOf(rowData);
        return (
            <div className="d-flex flex-column my-auto ms-auto">
                <select
                    name={`rating_${rowData.id}`}
                    id={`rating_${rowData.id}`}
                    className="form-select drop-down"
                    value={this.state.List.results[i].is_approved}
                    onChange={() => this.updateRatingStatus(i)}
                >
                    <option value="true">{t('Approved')}</option>
                    <option value="false">{t('Disapproved')}</option>
                </select>
            </div>
        )
    }
    updateRatingStatus = (i) => {
        let list = this.state.List;
        list.results[i].is_approved = !list.results[i].is_approved;
        patchCustomer(list.results[i].id, { is_approved: list.results[i].is_approved })
            .then((res) => {
                console.log("äpprov", res.data);
                this.setState({ List: list });
            })
            .catch((err) => console.log(err));
        // }       
    }
    StarComponent = (rating) => {
        let html = [];
        for (let i = 1; i <= 5; i++) {
            i <= rating
                ? html.push(
                    <span className="fa-solid fa-star-sharp checked"></span>
                )
                : html.push(<span className="fa-solid fa-star-sharp"></span>);
        }
        return html;
    }

    render() {
        console.log("userreview-list", this.state.List.results);
        const { t } = this.props
        return (
            <div className="userreview-table"
                style={{ width: "100%", height: "100%" }}>
                {/* {
                    this.state.List.results > 0 ? */}
                <DataTable
                    value={this.state.List.results}
                    scrollable
                    scrollHeight="100%"
                    emptyMessage={t('No Record Found')}
                >
                    <Column
                        body={this.Profile}
                    ></Column>
                    {
                        this.props.showApprove === "true" ?
                            <Column
                                body={this.button}
                            ></Column> :
                            null
                    }
                </DataTable>
                {/* //         :
                //         <center>{t('No Record Found')}</center>
                // } */}
            </div>
        )
    }
}
export default withTranslation()(withRouter(UserReview));

// export default UserReview