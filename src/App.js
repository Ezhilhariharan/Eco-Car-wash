import { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { connect } from "react-redux";
import Routing from "./components/Routing";
import "./App.scss";
import firebase1 from "./firebaseInit";
import firebase from "firebase/app";
import { FCMToken } from "./firebaseInit";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
class App extends Component {
    componentDidMount() {
        // console.log(this.props)
        let messaging = null;
        if (firebase.messaging.isSupported()) {
            messaging = firebase1.messaging();
            console.error("messaging suppported", messaging);
        }
        // !this.props.notify.token &&
        if (!this.props.notify.token && messaging) {
            console.log("1233", this.props, messaging);
            FCMToken()
                .then((token) => {
                    console.log("token received", token);
                    if (token) {
                        this.props.setToken(token);
                    } else {
                        console.log("error in fcm token");
                    }
                })
                .catch((err) => {
                    console.log("error found while retrive token");
                });

            messaging.onMessage((payload) => {
                console.log("in main", payload);
                if (payload.hasOwnProperty("notification")) {
                    this.props.setNotofication({
                        title: payload.notification.title,
                        body: payload.notification.body,
                    });
                } else if (!Object.hasOwnProperty("notification")) {
                    this.props.setNotofication({
                        title: "sample",
                        body: payload.data.default,
                    });
                } else {
                    alert("payload format not match");
                }
            });
        }
    }
    componentDidUpdate() {
        if (this.props.notify) {
            let emptys = this.props.notify;
            // console.log("times", emptys, this.messaging);
            // toast(emptys.body);
        }
    }
    render() {
        return (
            <div
                className={
                    this.props.theme.is_dark ? "theme--dark" : "theme--light"
                }
            >
                <div className="eco-app">
                    <Router>
                        <Routing />
                        <ToastContainer />
                    </Router>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        theme: state.theme,
        notify: state.tokens,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        setNotofication: (data) => {
            dispatch({ type: "NOTIFY_ME", data: data });
        },
        setToken: (data) => {
            dispatch({ type: "SET_TOKEN", data: data });
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
