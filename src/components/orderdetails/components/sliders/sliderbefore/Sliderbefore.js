import React, { Component } from "react";
import Slider from "react-slick";
import "./styles/Sliderbefore.scss";
import { Modal } from 'bootstrap';

class Sliderbefore extends Component {
  constructor(props) {
    super(props)
    this.state = {

      openModal: ""
    }
    this.modalRef = React.createRef()
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }
  showModal() {
    console.log("cool");
    const modalEle = this.modalRef.current
    const bsModal = new Modal(modalEle, {
      backdrop: 'static',
      keyboard: false
    })
    bsModal.show()
  }

  hideModal() {
    const modalEle = this.modalRef.current
    const bsModal = Modal.getInstance(modalEle)
    bsModal.hide()
    this.setState({ openModal: "", })

  }
  render() {
    const settings = {
      infinite: true,
      speed: 500,
      slidesToShow: 2,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 2000,
      pauseOnHover: true,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 3,
            infinite: true,
            dots: true,
          },
        },
        {
          breakpoint: 1200,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            initialSlide: 1,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 2,
            initialSlide: 2,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    };
    return (
      <div className="slider_before">
        {
          this.props.images.length === 1 ?
            <div className=" ms-5 ps-3 d-flex flex-row justify-content-center w-100 before_after">
              <img
                src={this.props.images?.[0].image}
                alt="No Image!!"
                onClick={() => this.setState({ openModal: this.props.images?.[0].image }, () => this.showModal())}
              />
            </div> :
            <Slider {...settings}>
              {this.props.images.map((data) => (
                <div className="before_after">
                  <img
                    src={data.image}
                    alt="No Image!!"
                    onClick={() => this.setState({ openModal: data.image }, () => this.showModal())}
                  />
                </div>
              ))
              }
            </Slider>
        }
        <div
          className="modal fade"
          ref={this.modalRef}
          tabIndex="-1"
        >

          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => this.hideModal()}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body mx-2">
                <div className="show_image">
                  <img
                    src={this.state.openModal}
                    alt="No Image!!"

                  />
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Sliderbefore;
