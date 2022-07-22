import { Component } from "react";
import { NavLink, withRouter } from "react-router-dom";
import Ecologo from "../../assets/ecologo.svg";
import { connect } from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import i18n from 'i18next';
import { withTranslation } from 'react-i18next';

let url;
class MainNav extends Component {
    constructor(props) {
        super(props);
    }
    onChange(e) {
        let val = e.target.value.length === 0 ? "" : e.target.value;
        this.props.searchFeild(val.trim());
        // console.log("typing", val);
    }

    render() {
        // console.log("menu", this.props.menu);
        const { t } = this.props
        return (
            <nav className="navbar sticky-top main-nav">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">
                        <img src={Ecologo} alt="" />
                    </a>
                    {this.props.menu.is_nav_menu_shown ? (
                        <div className="main-center-nav">
                            <NavLink
                                to="/configuration/cartype"
                                activeClassName="active"
                            >
                                {t('Cars')}
                            </NavLink>
                            <NavLink
                                to="/configuration/services"
                                activeClassName="active"
                            >
                                {t('Services')}
                            </NavLink>
                            <NavLink
                                to="/configuration/leave"
                                activeClassName="active"
                            >
                                {t('Leave')}
                            </NavLink>
                            <NavLink
                                to="/configuration/coupons"
                                activeClassName="active"
                            >
                                {t('Coupons')}
                            </NavLink>
                            <NavLink
                                to="/configuration/giftcoupons"
                                activeClassName="active"
                            >
                                {t('Gift Coupons')}
                            </NavLink>
                        </div>
                    ) : null}
                    {this.props.menu.show_Search ? (
                        <div class="input-group searchBar">
                            <input
                                type="text"
                                class="form-control type-search"
                                placeholder="name"
                                onChange={(e) => this.onChange(e)}
                            />
                            <div class="input-group-append">
                                <button class="btn search-color" type="button">
                                    <i class="fa fa-search"></i>
                                </button>
                            </div>
                        </div>
                    ) : null}
                    <div className="nav-corner-align d-flex flex-row">
                        <div className="round">
                            <select
                                className="select-dates"
                                onChange={(e) => {
                                    console.log("cool", e);
                                    i18n.changeLanguage(e.target.value)
                                }}
                            >
                                <option value="en">English</option>
                                <option value="fr">French</option>
                            </select>
                        </div>
                        <div
                            className="nav-profile-picture ms-auto me-3"
                            onClick={() => this.props.toggleMenu()}
                        >
                            <img src="https://picsum.photos/100" />
                        </div>
                        {this.props.menu.is_open ? (
                            <div className="nav-dropdown">
                                <div className="nav-dropdown-item">
                                    <span className="me-3">Dark Mode</span>
                                    <label className="customised-switch">
                                        <input
                                            type="checkbox"
                                            checked={this.props.theme.is_dark}
                                            onChange={() =>
                                                this.props.toggleTheme()
                                            }
                                        />
                                        <span className="customised-slider customised-round"></span>
                                    </label>
                                </div>
                                <div
                                    className="nav-dropdown-item"
                                    onClick={() => {
                                        this.props.toggleMenu();
                                        this.props.logout();
                                        this.props.history.push("/login");
                                    }}
                                >
                                    Logout{" "}
                                    <i className="fas fa-sign-out-alt ms-3"></i>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            </nav>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        theme: state.theme,
        user: state.user,
        menu: state.menu,
        dataset: state.tokens,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        toggleTheme: () => {
            dispatch({ type: "TOGGLE_THEME" });
        },
        toggleMenu: () => {
            dispatch({ type: "TOGGLE_MENU" });
        },
        searchFeild: (value) => {
            dispatch({ type: "SEARCH_FEILD", data: value });
        },
        logout: () => {
            dispatch({ type: "LOGOUT_USER" });
        },
    };
};

export default withTranslation()(connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(MainNav)));
