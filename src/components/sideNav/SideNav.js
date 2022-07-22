import homeIcon from "../../assets/home.svg";
import DashboardIcon from "../../assets/dashboard.svg";
import storeIcon from "../../assets/stores.svg";
import customersIcon from "../../assets/customers.svg";
import GarageIcon from "../../assets/garage.svg";
import cleanerIcon from "../../assets/cleaners.svg";
import managerIcon from "../../assets/manager.svg";
import EcommerceIcon from "../../assets/ecommerce.svg";
import settingsIcon from "../../assets/config.svg";
import financeIcon from "../../assets/finance.svg";
import { withTranslation } from 'react-i18next';
import { NavLink } from "react-router-dom";

const SideNav = (props) => {
    const { t } = props
    return (
        <div>
            <nav className="side-nav">
                {/* <NavLink exact to="/login" activeClassName="active">
                    <img src={homeIcon} className="side-nav-icons" alt="" />
                    <span className="side-nav-text">Home</span>
                </NavLink> */}
                <NavLink exact to="/" activeClassName="active">
                    <img
                        src={DashboardIcon}
                        className="side-nav-icons"
                        alt=""
                    />
                    <span className="side-nav-text">{t('Dashboard')}</span>
                </NavLink>
                <NavLink to="/stores" activeClassName="active">
                    <img src={storeIcon} className="side-nav-icons" alt="" />
                    <span className="side-nav-text">{t('Stores')}</span>
                </NavLink>
                <NavLink to="/customer" activeClassName="active">
                    <img
                        src={customersIcon}
                        className="side-nav-icons"
                        alt=""
                    />
                    <span className="side-nav-text">{t('Customers')}</span>
                </NavLink>
                <NavLink to="/garage" activeClassName="active">
                    <img src={GarageIcon} className="side-nav-icons" alt="" />
                    <span className="side-nav-text">{t('Garage')}</span>
                </NavLink>
                <NavLink to="/cleaner" activeClassName="active">
                    <img src={cleanerIcon} className="side-nav-icons" alt="" />
                    <span className="side-nav-text">{t('Cleaners')}</span>
                </NavLink>
                <NavLink to="/manager" activeClassName="active">
                    <img src={managerIcon} className="side-nav-icons" alt="" />
                    <span className="side-nav-text">{t('Manager')}</span>
                </NavLink>
                <NavLink to="/ecommerce" activeClassName="active">
                    <img
                        src={EcommerceIcon}
                        className="side-nav-icons"
                        alt=""
                    />
                    <span className="side-nav-text">{t('E commerce')}</span>
                </NavLink>
                <NavLink to="/configuration" activeClassName="active">
                    <img src={settingsIcon} className="side-nav-icons" alt="" />
                    <span className="side-nav-text">{t('Configuration')}</span>
                </NavLink>
                <NavLink to="/finance" activeClassName="active">
                    <img src={financeIcon} className="side-nav-icons" alt="" />
                    <span className="side-nav-text">{t('Finance Module')}</span>
                </NavLink>
            </nav>
        </div>
    );
};

export default withTranslation()(SideNav);
