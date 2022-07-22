import React, { Component } from "react";
import "./styles/LoginLayout.scss";
import { withRouter } from "react-router";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import { connect } from "react-redux";
import Ecologo from "../../assets/ecologo.svg";
import street from "../../assets/login_logos/street2.svg";
import cars from "../../assets/login_logos/car_running.svg";
import ErrorModal from "../common_component/errormodal/Errormodal"
class LoginLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // profile: "https://avatars.dicebear.com/api/initials/random.svg",
            errorMsg: "",
            showHidecurrentPassword: false,
        };
        this.Errormodalref = React.createRef();
    }
    componentDidMount() {
        // clear token for login
        // localStorage.setItem('isloggedin', JSON.stringify(false));
        // localStorage.removeItem('eco_token');
        // delete axios.defaults.headers.common["Authorization"];
        // this.props.logout()
        // this.showSuccess()
        // console.log('login', this.props)
        // this.props.toster()
        // let data = this.props.settoken.token;
        // console.log("recived data tokens:->", data);
    }

    render() {
        return (
            <div className="login-layout">
                <div className="login-head">
                    <div className="welcome_eco">
                        <span className="wel_to">Welcome to </span>
                        <span className="eco"> Eco-CarWash</span>
                    </div>

                    {/* <div className="bottom_logos">
                        <img src={street} className="streets" />
                        <img src={cars} className="cars" />
                    </div> */}
                    {/* <p>{this.props.settoken.token}</p> */}
                </div>

                <div className="login-body">
                    <div className="login-body-inner">
                        <h1>Log In</h1>

                        <Formik
                            initialValues={{
                                email: "",
                                password: "123456",
                            }}
                            onSubmit={(values, onSubmitProps) => {
                                // onSubmitProps.resetForm()
                                // console.log(values);
                                var formData = new FormData();
                                formData.append("email", values["email"]);
                                formData.append("password", values["password"]);
                                if (this.props.settoken.token) {
                                    formData.append(
                                        "fcm_token",
                                        this.props.settoken.token
                                    );
                                }
                                axios
                                    .post("auth/login/", formData)
                                    .then((res) => {
                                        console.log(res.data.Data);
                                        if (res.data.Status) {
                                            console.log(res.data.Data);
                                            this.props.loginUser(
                                                res.data.Data.access_token
                                            );
                                            // console.log("------>",localStorage.getItem('eco_token'));
                                            axios.defaults.headers.common[
                                                "Authorization"
                                            ] =
                                                "Token " +
                                                localStorage.getItem("eco_token");
                                            this.props.history.push("/");
                                        } else {
                                            this.setState({ errorMsg: res.data.Message })
                                            this.Errormodalref.current.showModal()
                                        }
                                    })
                                    .catch((error) => {
                                        console.log("user not found", error.res);
                                        localStorage.clear();
                                        delete axios.defaults.headers.common[
                                            "Authorization"
                                        ];
                                        // if (!error.response.data.Status) {
                                        //     if (error.response.data.hasOwnProperty('Message')) {
                                        //         this.setState({ errorMsg: error.response.data.Message })
                                        //         this.Errormodalref.current.showModal()
                                        //     }
                                        // }
                                    });
                            }}
                        >
                            <Form className="login">
                                <div className="form-floating mb-3">
                                    <Field
                                        id="email"
                                        name="email"
                                        type="email"
                                        className="form-control"
                                        placeholder="Enter Email"
                                    />
                                    <label htmlFor="email">Email</label>
                                    <ErrorMessage name="name">
                                        {(msg) => <div>{msg}</div>}
                                    </ErrorMessage>
                                </div>

                                <div className="form-floating mb-3">
                                    {/* <div className=" d-flex flex-row"> */}
                                    <Field
                                        id="password"
                                        name="password"
                                        type={this.state.showHidecurrentPassword ? "text" : "password"}
                                        className="form-control"
                                        placeholder="Enter Password"
                                    />
                                    <i
                                        className={
                                            this.state.showHidecurrentPassword
                                                ? "fa-solid fa-eye show-icon   mt-3"
                                                : "fa-solid fa-eye-slash show-icon  mt-3 "
                                        }
                                        onClick={() =>
                                            this.setState({
                                                showHidecurrentPassword:
                                                    !this.state.showHidecurrentPassword,
                                            })
                                        }
                                    ></i>
                                    {/* </div> */}
                                    <label htmlFor="name">Password</label>
                                    <ErrorMessage name="name">
                                        {(msg) => <div>{msg}</div>}
                                    </ErrorMessage>
                                </div>

                                <button
                                    type="submit"
                                    className="btn-navy mx-auto m-5"
                                >
                                    Log In
                                </button>
                            </Form>
                        </Formik>
                        <div className="car_end_logo">
                            <img src={Ecologo} className="eco-car-logo" />
                        </div>
                    </div>
                </div>
                <ErrorModal ref={this.Errormodalref} message={this.state.errorMsg} />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
        settoken: state.tokens,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        loginUser: (data) => {
            dispatch({ type: "LOGIN_USER", data });
        },
        logout: () => {
            dispatch({ type: "LOGOUT_USER" });
        },
        same: () => {
            dispatch({ type: "SET_TOKEN" });
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(LoginLayout));
