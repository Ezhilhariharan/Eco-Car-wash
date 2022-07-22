import React, { Component } from "react";
import { Modal } from "bootstrap";

class Errormodal extends Component {
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
        const { message } = this.props
        return (
            <div>
                <div className="modal" ref={this.modalRef} tabIndex="-1">
                    <div className="modal-dialog modal-md">
                        <div className="modal-content pt-5 pb-5">
                            <div className="modal-body mx-auto">
                               <h6>{message}</h6> 
                            </div>
                            <button
                                className="btn-navy mx-auto mt-3 w-25"
                                type="submit"
                                onClick={this.hideModal}
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Errormodal