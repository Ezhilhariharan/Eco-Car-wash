import { NavLink, withRouter, useRouteMatch } from "react-router-dom";
import "./../../../../../cleaner/Components/viewCleaner/styles/ViewCleaner.scss";
import "./styles/StoreMenu.scss";
import LinesEllipsis from "react-lines-ellipsis";
import { useState, useEffect } from "react";
import axios from "axios";
import AssignManagerIcon from "../../../../../../assets/assignManagerIcon.svg";
import AssignCleanerIcon from "../../../../../../assets/assignCleanerIcon.svg";
import ServicesConfigIcon from "../../../../../../assets/configureServicesIcon.svg";
import LeaveManagementIcon from "../../../../../../assets/leaveManagementIcon.svg";
import UserReviewsLayout from "../../../../../common/userReviews/UserReviewsLayout";
import { useTranslation } from 'react-i18next';


const StoreMenu = ({ changeMenu, forUserReview }) => {
	const { t, i18n } = useTranslation();
	let { path, url, id } = useRouteMatch();
	const [reviewData, setReviewData] = useState([]);

	url = url.split("/");
	id = url.pop();
	url = url.join("/");
	// console.log("StoreMenu:", forUserReview);

	const getRating = () => {
		axios
			.get(`/admin/manage_ratings/?store=${id}`)
			.then((res) => {
				if (res.data.Status) {
					setReviewData(res.data.Data);
				} else {
					console.error(res);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const StoreStarComponent = (rating) => {
		let html = [];
		for (let i = 1; i <= 5; i++) {
			i <= rating
				? html.push(<span className="fa-solid fa-star-sharp checked"></span>)
				: html.push(<span className="fa-solid fa-star-sharp"></span>);
		}
		return html;
	};

	useEffect(() => {
		getRating();
	}, []);

	return (
		<div className="store-menu-body">
			<div className="add-agent-buttons">
				<div
					onClick={() => changeMenu(2)}
					className="d-flex flex-row p-1 btn-white-create justify-content-between"
					style={{ cursor: "pointer" }}
				>
					<div style={{ backgroundColor: "#E8F9F8" }} className="d-flex rounded justify-content-center align-items-center m-1 col-2">
						<img src={AssignManagerIcon} className="img-fluid" alt="" />
					</div>
					<p className="d-flex  ps-1 col-8 my-auto">{t('Assign Manager')}</p>
					<i class="fas fa-chevron-right col-1 m-auto"></i>
				</div>
				<div onClick={() => changeMenu(3)} className="d-flex flex-row p-1 btn-white-create justify-content-between" style={{ cursor: "pointer" }}
				>
					<div style={{ backgroundColor: "#E8F9F8" }} className="d-flex rounded justify-content-center align-items-center m-1 col-2">
						<img src={AssignCleanerIcon} className="img-fluid" alt="" />
					</div>
					<p className="d-flex ps-1 col-8 my-auto">{t('Assign Cleaner')}</p>
					<i class="fas fa-chevron-right col-1 m-auto"></i>
				</div>
				<div onClick={() => changeMenu(4)} className="d-flex flex-row p-1 btn-white-create justify-content-between" style={{ cursor: "pointer" }}
				>
					<div style={{ backgroundColor: "#E8F9F8" }} className="d-flex rounded justify-content-center align-items-center m-1 col-2">
						<img src={ServicesConfigIcon} className="img-fluid" alt="" />
					</div>
					<p className="d-flex ps-1 col-8 my-auto">{t('Configure Services')}</p>
					<i class="fas fa-chevron-right col-1 m-auto"></i>
				</div>
				{/* ?store=${id} */}
				<NavLink style={{ textDecoration: "none", color: "black" }} to={`/stores/leavedetails/store=${id}`}>
					<div style={{ textDecoration: "none" }} className="d-flex flex-row p-1 btn-white-create justify-content-between">
						<div style={{ backgroundColor: "#E8F9F8" }} className="d-flex rounded justify-content-center align-items-center m-1 col-2">
							<img src={LeaveManagementIcon} className="img-fluid" alt="" />
						</div>
						<p className="d-flex ps-1 col-8 my-auto">{t('Leave Management')}</p>
						<i class="fas fa-chevron-right col-1 m-auto"></i>
					</div>
				</NavLink>
			</div>
			<div className="user-reviews">
				<UserReviewsLayout id={forUserReview} />
			</div>
		</div>
	);
};

export default withRouter(StoreMenu);
