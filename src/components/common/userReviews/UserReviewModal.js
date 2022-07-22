import React, { Component } from 'react'
import { Modal } from "bootstrap";
import UserReview from "./UserReview"
import { Translation } from 'react-i18next';

class UserReviewModal extends Component {
    constructor(props) {
        super(props)
        this.modalRef = React.createRef();
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
    }
    showModal() {
        const modalEle = this.modalRef.current;
        const bsModal = new Modal(modalEle, {
            backdrop: "static",
            keyboard: false,
        });
        bsModal.show();
    }
    hideModal() {
        const modalEle = this.modalRef.current;
        const bsModal = Modal.getInstance(modalEle);
        bsModal.hide();
    }
    render() {
        return (
            <Translation>{
                (t, { i18n }) =>
                    <div className="userreview-modal">
                        <div className="modal" ref={this.modalRef} tabIndex="-1">
                            <div className="modal-dialog modal-lg">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">{t('Review List')}</h5>
                                        <button
                                            type="button"
                                            className="btn-close"
                                            onClick={() => this.hideModal()}
                                            aria-label="Close"
                                        ></button>
                                    </div>
                                    <div className="modal-body">
                                        <UserReview
                                            URL={this.props.URL}
                                            showApprove={this.props.showApprove}
                                            ID={this.props.ID}
                                            id={this.props.id}
                                            Cleaner_id={this.props.Cleaner_id}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            }
            </Translation>
        )
    }
}

export default UserReviewModal