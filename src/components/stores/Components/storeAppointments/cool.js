import React, { useEffect, useState, useRef } from "react";
import { useRouteMatch, useParams, useHistory } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import axios from "axios";
import flatpickr from "flatpickr";

import { AppointmentsData } from "./assets/AppointmentsData";
import "./styles/StoreAppointments.scss";

const monthString = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const StoreAppointments = () => {
    let { url } = useRouteMatch();
    let { id } = useParams();
    let flatpick = useRef();
    let history = useHistory();
    let [month, setMonth] = useState(`${monthString[new Date().getMonth()]} ${new Date().getFullYear()}`);
    let [currentDate, setDate] = useState(`${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`);
    let [appointmentsList, setAppointmentList] = useState([]);
    let [cleanerList, setCleanerList] = useState([]);
    let [lock, setLock] = useState(false);
    let [page, setPage] = useState(1);
    let appointment = new AppointmentsData()

    useEffect(() => {
        flatpickr(flatpick.current, {
            defaultDate: currentDate,
            dateFormat: "Y-m-d",
            onChange: (selectedDates, dateStr, instance) => {
                setDate(dateStr);
            }
        })
        // console.log("url", id)
    }, [])

    useEffect(() => {
        loadAppointmentData()
        loadCleanerData()
        scrollLoader()
    }, [currentDate]);

    const scrollLoader = () => {
        let scroller = document.getElementsByClassName(
            "p-datatable-scrollable-body"
        )[0];
        let scrollerBody = document.getElementsByClassName(
            "p-datatable-scrollable-body-table"
        )[0];
        scroller.addEventListener("scroll", () => {
            if (
                scroller.scrollTop >
                (scrollerBody.clientHeight - scroller.clientHeight) * 0.9
            ) {
                if (!lock && appointmentsList.next) {
                    console.log("cool");
                    setLock(true)
                    setPage(page + 1)
                    loadAppointmentData()
                    // setPage(page + 1, () => loadAppointmentData())

                    // this.setState({ lock: true }, () => {
                    // if (
                    //   this.state.studentCount / this.state.studentResultsLength >
                    //   this.state.page
                    // ) {
                    // this.setState({ page: this.state.page + 1 }, () => {
                    //   if (storePath.split("&")[0]) {
                    //     this.orderDetails()
                    //   } else {
                    //     let appointment_id = storePath.split("&")[1].split("=")[1]
                    //     this.loadAppointmentData(appointment_id)
                    //   }
                    // });
                    // }
                    // });
                }
            }
        });
    }
    const loadAppointmentData = (reset = false) => {
        let list;
        axios
            .get(`/admin/manage_appointments/?${id}&page_no=${page}`)
            .then((res) => {
                console.log('appointment ', res.data.Data);
                if (res.data.Status) {
                    // setAppointmentList(res.data.Data);
                    if (Object.keys(appointmentsList).length !== 0 && !reset) {
                        list = appointmentsList.results;
                        list.push(...res.data.Data.results);
                        res.data.Data.results = list;
                        setAppointmentList(res.data.Data);
                    } else {
                        setAppointmentList(res.data.Data);
                    }
                    setLock(false)
                } else {
                    console.error(res);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }
    const loadCleanerData = () => {
        axios
            .get(`/admin/manage_user_leave/?store=${id}&date=${currentDate}`)
            .then((res) => {
                console.log('cleaner list', res.data.Data);
                if (res.data.Status) {
                    setCleanerList(res.data.Data)
                } else {
                    console.error(res);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const onAppointmentClick = (rowData) => {
        history.push(`/orderdetails/${rowData.data.id}`)
    }

    const printDate = () => {
        let date = new Date(currentDate);
        return `${date.getDate()} ${date.toLocaleString("en-us", { month: "long" })} ${date.getFullYear()}`;
    }
    console.log("appointmentsList", appointmentsList);
    return (
        <div className="store-appointments">
            <div className="store-appointments-head">
                <button className="btn-navy-circle me-4" onClick={() => history.goBack()}><i className="fa fa-chevron-left"></i></button>
                <h1 className="">Bookings</h1>
                <div className="absentee-section">
                    {
                        cleanerList.map((cleaner, index) => {
                            return (
                                <div className="absentee-tab col-4" key={index} onClick={() => {
                                    history.push(`/leavedetails?cleaner=${cleaner.user.username}`)
                                }}>
                                    <div className="absentee-profile-picture col-4 ms-2">
                                        <img src="https://picsum.photos/40" />
                                    </div>
                                    <p className="ms-2 my-auto col-5">{cleaner.user.name}</p>
                                    <p className="ms-auto my-auto col-3" style={{ color: "#6DDFD8" }}>On Leave</p>
                                </div>
                            )
                        })
                    }
                </div>
            </div>

            <div className="store-appointments-body">
                <div className="appointments-calendar">
                    <div className="date">
                        {
                            printDate()
                        }
                    </div>
                    <div className="appointment-count mt-3">
                        {appointmentsList.length} Appointments
                    </div>
                    <div className="month-setter mt-3 w-50">
                        <label htmlFor="" style={{ color: 'white' }}>Select date:</label>
                        <input
                            type="date"
                            className="form-control"
                            // onChange={(e) => setDate(e.target.value)} 
                            ref={flatpick}
                        />
                        <i className="fas fa-calendar"></i>
                    </div>
                    <div className="calendar mt-5">
                        {/* <Calendar /> */}
                    </div>
                </div>
                <div className="appointments-table">
                    <DataTable value={appointmentsList.results} scrollable scrollHeight="100%" responsiveLayout="scroll" onRowClick={onAppointmentClick}>
                        <Column field="name" header="Name" body={appointment.nameTemplate}></Column>
                        <Column field="mobile_no" header="Mobile No" body={appointment.phoneTemplate}></Column>
                        <Column field="email" header="email" body={appointment.emailTemplate}></Column>
                        <Column field="appointment_nature" header="Type"></Column>
                        <Column field="appointment_status" header="Status"></Column>
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default StoreAppointments;