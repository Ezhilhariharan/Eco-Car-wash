import "./styles/UserReviewsLayout.scss";
import React, { useRef } from "react";
import UserReview from "./UserReview";
import UserReviewModal from "./UserReviewModal"
import { useTranslation } from 'react-i18next';

export default function UserReviewsLayout(props) {
    const User_Review = useRef();
    const { t, i18n } = useTranslation();
    return (
        <div className="card">
            <div className="card-body">
                <div className="d-flex flex-row justify-content-between cards_back">
                    <h5
                    >
                        {t('User Reviews')}
                    </h5>
                    <span className="view-more" style={{ cursor: "pointer" }}
                        onClick={() => User_Review.current.showModal()}> {t('View more')}</span>
                </div>
                <UserReview ID={props.id} showApprove="true" />
            </div>
            <UserReviewModal ref={User_Review} ID={props.id} showApprove="true" />
        </div>
    );
}

