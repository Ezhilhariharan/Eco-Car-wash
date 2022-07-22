import React, { useState } from "react";
import { Chart } from "primereact/chart";
import { Skeleton } from "primereact/skeleton";

function WebinarAppointment(props) {
  const { webinar, appointment } = props;
  const [active, setActive] = useState(1);

  const basicData1 = {
    labels: ["Completed", "Yet to start"],
    datasets: [
      {
        label: "Appointmet",
        backgroundColor: "#2a2e4b",
        data: [...webinar],
      },
    ],
  };

  const basicData2 = {
    labels: ["Completed", "Yet to start"],
    datasets: [
      {
        label: "Webinar",
        backgroundColor: "#FF7A00",
        data: [...appointment],
      },
    ],
  };

  var horizontalOptions = {
    indexAxis: "y",
    maintainAspectRatio: false,
    aspectRatio: 1.9,
    plugins: {
      legend: {
        labels: {
          color: "#495057",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#495057",
        },
        grid: {
          color: "white",
        },
      },
      y: {
        ticks: {
          color: "#495057",
        },
        grid: {
          color: "white",
        },
      },
    },
  };

  return (
    <div className="appointmentandwebinor-graph ">
      <div className="d-flex flex-row p-3">
        <div
          className={
            active === 1
              ? "active-header heading-size  d-flex flex-row me-2"
              : "heading-size  d-flex flex-row me-2"
          }
          onClick={() => setActive(1)}
        >
          <div className="appointment-dot ms-2 me-1 "></div>
          <div
            className="col-3 heading d-flex flex-row "
            data-bs-target="#appointmentandwebinor-graph"
            data-bs-slide-to="0"
          >
            Appointment
          </div>
        </div>
        <div
          className={
            active === 2
              ? "active-header heading-size  d-flex flex-row me-2"
              : "heading-size  d-flex flex-row me-2"
          }
          onClick={() => setActive(2)}
        >
          <div className="Webinor-dot ms-2 me-1"></div>
          <div
            className="col-3 heading d-flex flex-row"
            data-bs-target="#appointmentandwebinor-graph"
            data-bs-slide-to="1"
          >
            Webinor
          </div>
        </div>
      </div>
      <div
        id="appointmentandwebinor-graph"
        className="carousel slide w-100 h-100"
        data-bs-interval="false"
      >
        <div className="carousel-inner">
          <div className="carousel-item active w-100 px-4 py-4 ">
            <Chart
              type="bar"
              data={basicData1}
              options={horizontalOptions}
              style={{ width: "92%", height: "85%" }}
            />
          </div>
          <div className="carousel-item w-100 px-4 py-4">
            <Chart
              type="bar"
              data={basicData2}
              options={horizontalOptions}
              style={{ width: "92%", height: "85%" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default WebinarAppointment;
