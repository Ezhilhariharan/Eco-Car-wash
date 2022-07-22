import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { DateSchema } from "yup";
import { getOrderData } from "../../api/GET";
import Sliderafter from "../sliders/sliderafter/Sliderafter";
import Sliderbefore from "../sliders/sliderbefore/Sliderbefore";
import "./styles/ViewCustomerStyle.scss";
import axios from "axios";
import { withTranslation } from 'react-i18next';
let url, id;
let before = [];
let after = [];
class OrderSummary extends Component {
    constructor(props) {
        super(props);
        url = this.props.match.path;
        id = this.props.match.params.id;
        this.state = {
            orderData: {},
            OrderServicesDatas: [],
            StandardData: [],
            exteriorStandard: [],
            PremiumData: [],
            exteriorPremium: [],
            afterImage: [],
            beforeImage: []
        };
    }

    componentDidMount() {
        this.initialUpdate()
    }
    componentWillUnmount() {
        this.setState({
            StandardData: [],
            PremiumData: [],
            exteriorStandard: [],
            exteriorPremium: [],
            afterImage: [],
            beforeImage: [],
            orderData: {},
        });
        console.log("cool componentWillUnmount");
    }
    initialUpdate = () => {
        getOrderData(id)
            .then((res) => {
                let datas = res.data.Data.services;
                let StandardData = [];
                let PremiumData = [];
                let exteriorStandard = [];
                let exteriorPremium = [];
                datas.map((datas) => {
                    if (
                        datas.service_nature === "Standard" &&
                        datas.service_type === "Interior"
                    ) {
                        StandardData.push(datas);
                    } else if (
                        datas.service_nature === "Premium" &&
                        datas.service_type === "Exterior"
                    ) {
                        PremiumData.push(datas);
                    } else if (
                        datas.service_nature === "Standard" &&
                        datas.service_type === "Exterior"
                    ) {
                        exteriorStandard.push(datas);
                    } else if (
                        datas.service_nature === "Premium" &&
                        datas.service_type === "Exterior"
                    ) {
                        exteriorPremium.push(datas);
                    }
                });
                this.setState({
                    StandardData: StandardData,
                    PremiumData: PremiumData,
                    exteriorStandard: exteriorStandard,
                    exteriorPremium: exteriorPremium,
                });

                console.log("order data", res.data.Data);

                this.setState({ orderData: res.data.Data });
                this.setState({ OrderServicesDatas: res.data.Data.services });
                if (res.data.Data.appointment_images.length > 0) {
                    res.data.Data.appointment_images.map((data) => {
                        // if (data.image_type == "Before") {
                        //     before.push({ ...data })
                        // } else {
                        //     after.push({ ...data })
                        // }
                        this.setState({
                            beforeImage: res.data.Data.appointment_images.filter((item) => item.image_type == "Before")
                            , afterImage: res.data.Data.appointment_images.filter((item) => item.image_type == "After")
                        });
                    })
                }
                // this.setState({ beforeImage: before, afterImage: after });
            })
            .catch((err) => {
                console.log("error api", err);
            });
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
    generateInvoice = () => {
        axios
            .get(`/api/manage_appointments/get_invoice/?appointment=${id}`)
            .then((res) => {
                // console.log("generateInvoice", res);
                this.initialUpdate()
            })
            .catch((err) => {
                console.log(err);
            });
    }
    downloadInvoice = (rowData) => {
        // console.log(rowData);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = rowData.invoice_file;
        a.download = rowData.invoice_number + '.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(rowData);
    }
    render() {
        const settings = {
            dots: false,
            infinite: false,
            speed: 500,
            slidesToShow: 2,
            slidesToScroll: 2,
        };

        console.log(this
            .state
            .orderData
            ?.store
            ?.image);
        const { t } = this.props

        return (
            <div className="view-cutomer-section">
                <div className="customer-section-body">
                    <div className="customer-profile-dashboard">
                        <div className="card w-100 h-100">
                            <div className="card-body">
                                <button
                                    className="btn-navy-circle"
                                    onClick={() =>
                                        this.props.history.goBack()
                                    }
                                >
                                    <i className="fas fa-chevron-left"></i>
                                </button>
                                <h3 className="summary pt-3">
                                    {t('Order Summary')}
                                </h3>
                                <div className="profile-picture border" style={{
                                    width: "130px",
                                    height: "130px",
                                }}>
                                    <img
                                        src={

                                            this.state.orderData?.customer?.profile_image ? this.state.orderData.customer.profile_image :
                                                `https://avatars.dicebear.com/api/initials/${this.state.orderData?.customer?.username}.svg`
                                        }
                                    />
                                </div>
                                <h5 className="fw-bold username">
                                    {this.state.orderData?.customer?.username}
                                </h5>
                                <div className="d-flex flex-column align-items-center">
                                    <p
                                        className="phoes"
                                        style={{
                                            color: "#63666A",
                                            fontWeight: "700",
                                        }}
                                    >
                                        {t('Phone')}
                                    </p>
                                    <p>
                                        {" "}
                                        {
                                            this.state.orderData?.customer
                                                ?.mobile_no
                                        }
                                    </p>
                                </div>
                                <div className="d-flex flex-column align-items-center">
                                    <p
                                        style={{
                                            color: "#63666A",
                                            fontWeight: "700",
                                        }}
                                    >
                                        {t('Email')}
                                    </p>
                                    <p>
                                        {" "}
                                        {
                                            this.state.orderData?.customer
                                                ?.email
                                        }
                                    </p>
                                </div>
                                <div className="d-flex flex-column align-items-center">
                                    <p
                                        style={{
                                            color: "#63666A",
                                            fontWeight: "700",
                                        }}
                                    >
                                        {t('Address')}
                                    </p>
                                    <p>
                                        {" "}
                                        {
                                            this.state.orderData?.address
                                                ?.address
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="view-customer-services">
                        <div className="card  ">
                            <div className="card-body">
                                <div className="d-flex flex-column car-type-section">
                                    <div className="car-type-details ">
                                        <h4 className=" car_type"> {t('Car Type')}</h4>
                                        <div className="d-flex flex-row mt-3">
                                            <div className="col-3">
                                                <p>{t('Type')}</p>
                                                <p>
                                                    {
                                                        this.state.orderData
                                                            ?.user_car?.car_type
                                                    }
                                                </p>
                                            </div>
                                            <div className="col-3">
                                                <p>{t('Make')}</p>
                                                <p>
                                                    {
                                                        this.state.orderData
                                                            ?.user_car?.car_make
                                                    }
                                                </p>
                                            </div>
                                            <div className="col-3">
                                                <p>{t('Model')}</p>
                                                <p>
                                                    {
                                                        this.state.orderData
                                                            ?.user_car
                                                            ?.car_model
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="car-type-service ">
                                        <h5 className=" services">{t('Service')}</h5>

                                        {this.state.StandardData ? (
                                            <div className="box">
                                                <div className="split_interior">
                                                    <h5 classname="texts">
                                                        {t('Interior')}
                                                    </h5>
                                                    <p className="standard">
                                                        {t('Standard')}
                                                    </p>
                                                </div>
                                                <div className="back_datas">
                                                    {this.state.StandardData ? (
                                                        <div>
                                                            {this.state.StandardData.map(
                                                                (
                                                                    data,
                                                                    index
                                                                ) => {
                                                                    return (
                                                                        <div className="split_serices">
                                                                            <p className="datas_title">
                                                                                {
                                                                                    data.title
                                                                                }
                                                                            </p>
                                                                            <p>
                                                                                /
                                                                            </p>
                                                                            <p>
                                                                                {
                                                                                    data.price
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                    );
                                                                }
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div> {t('No Record Found')}</div>
                                                    )}
                                                    <div className="split_interior">
                                                        <h5 classname="texts">
                                                            {t('Exterior')}
                                                        </h5>
                                                        <p className="standard">
                                                            {t('Standard')}
                                                        </p>
                                                    </div>
                                                    {this.state
                                                        .exteriorStandard ? (
                                                        <div>
                                                            {this.state.exteriorStandard.map(
                                                                (
                                                                    data,
                                                                    index
                                                                ) => {
                                                                    return (
                                                                        <div className="split_serices">
                                                                            <p className="datas_title">
                                                                                {
                                                                                    data.title
                                                                                }
                                                                            </p>
                                                                            <p>
                                                                                /
                                                                            </p>
                                                                            <p>
                                                                                {
                                                                                    data.price
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                    );
                                                                }
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div>{t('thanks')}</div>
                                                    )}

                                                    {this.state.PremiumData ? (
                                                        <div>
                                                            {this.state.PremiumData.map(
                                                                (
                                                                    data,
                                                                    index
                                                                ) => {
                                                                    return (
                                                                        <div className="split_serices">
                                                                            <p className="datas_title">
                                                                                {
                                                                                    data.title
                                                                                }
                                                                            </p>
                                                                            <p>
                                                                                /
                                                                            </p>
                                                                            <p>
                                                                                {
                                                                                    data.price
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                    );
                                                                }
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div>{t('thanks')}</div>
                                                    )}

                                                    {this.state
                                                        .exteriorPremium ? (
                                                        <div>
                                                            {this.state.exteriorPremium.map(
                                                                (
                                                                    data,
                                                                    index
                                                                ) => {
                                                                    return (
                                                                        <div className="split_serices">
                                                                            <p className="datas_title">
                                                                                {
                                                                                    data.title
                                                                                }
                                                                            </p>
                                                                            <p>
                                                                                /
                                                                            </p>
                                                                            <p>
                                                                                {
                                                                                    data.price
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                    );
                                                                }
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div>{t('thanks')}</div>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <div>{t('No Data!!')}</div>
                                        )}
                                    </div>

                                    <div className="product_payment_pricing">
                                        <div className="left_pricing">
                                            <h4 className="payment_price ">
                                                {t('Pricing & Payment')}
                                            </h4>
                                            <span>
                                                $
                                                {
                                                    this.state.orderData
                                                        .amount_paid
                                                }
                                                <span className="debit_card ">
                                                    -  {t('Debit Card')}
                                                </span>
                                            </span>
                                            <div className="mt-1">
                                                <span
                                                    className="px-2 discounts"
                                                    style={{
                                                        color: " #979797",
                                                    }}
                                                >
                                                    {t('Payment Status')}
                                                </span>
                                                {
                                                    this.state.orderData
                                                        .payment_status
                                                }
                                            </div>
                                            <div className="mt-1">
                                                <span
                                                    className="px-2 discounts"
                                                    style={{
                                                        color: " #979797",
                                                    }}
                                                >
                                                    {t('Discount applied')}
                                                </span>
                                                {
                                                    this.state.orderData
                                                        .applied_coupon
                                                        ?.discount_amount
                                                }
                                            </div>

                                        </div>
                                        <div className="right_pricing">
                                            <h6 className="time">
                                                {this.state.orderData.date}
                                            </h6>
                                            <div className="digital_time">
                                                <h3 className="time">
                                                    {this.state.orderData.start_time}
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="right_split_photos">
                                    <div className="start">
                                        <h1 className="photo_name">{t('Photos')}</h1>
                                        <div className="before">
                                            <div className="w-100 d-flex flex-row justify-content-start">
                                                <span className="after">
                                                    {t('Before')}
                                                </span>
                                            </div>
                                            <Sliderbefore images={this.state.beforeImage} />
                                            <div className="w-100 d-flex flex-row justify-content-start">
                                                <span className="after">{t('After')}</span>
                                            </div>
                                            <Sliderafter images={this.state.afterImage} />
                                        </div>
                                    </div>
                                    <div className="middle">
                                        <div className="reviews">
                                            <h6 className="review">{t('Review')}</h6>
                                            <div className="d-flex flex-row justify-content-between">
                                                <div className="d-flex flex-column">
                                                    <div className="split_profiles">
                                                        <div className="inside_split_profiles">
                                                            {/* <div className="reviews-profile-picture me-2 border">
                                                                {
                                                                    this
                                                                        .state
                                                                        .orderData
                                                                        ?.store
                                                                        ?.image ? <img
                                                                        src={
                                                                            this
                                                                                .state
                                                                                .orderData
                                                                                ?.store
                                                                                ?.image
                                                                        }
                                                                    /> : ""
                                                                }
                                                            </div> */}
                                                            <p className="my-auto">
                                                                {this.state.orderData.appointment_rating?.review ?
                                                                    this.state.orderData.appointment_rating?.review : t('No Reviews')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <p className="description mt-2 text-center">
                                                        {
                                                            this.state.orderData
                                                                .applied_coupon
                                                                ?.description
                                                        }
                                                    </p>
                                                </div>
                                                <div className="d-flex flex-column ratting">
                                                    <div className="stars">
                                                        {/* <span class="fa fa-star checked"></span>
                                                        <span class="fa fa-star checked"></span>
                                                        <span class="fa fa-star checked"></span>
                                                        <span class="fa fa-star checked"></span> */}
                                                        {this.state.orderData.appointment_rating?.rating ?
                                                            this.StarComponent(this.state.orderData.appointment_rating?.rating) : ""}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="end">
                                        <div className="product">
                                            <div className="left_product">
                                                <span className="products">
                                                    {t('Product')}
                                                </span>
                                                <p className="cars_perfume">
                                                    {t('Car perfume')}{" "}
                                                    <span className="price_car">
                                                        30$
                                                    </span>
                                                </p>
                                            </div>
                                            <div className="right_product">
                                                {
                                                    this.state.orderData
                                                        .invoice ?
                                                        <button className="btn_export" onClick={() => this.downloadInvoice(this.state.orderData
                                                            .invoice)} >
                                                            {t('Download')}
                                                        </button> :
                                                        <button className="btn_export" onClick={this.generateInvoice}>
                                                            {t('Generate')}
                                                        </button>
                                                }

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withTranslation()(withRouter(OrderSummary));
