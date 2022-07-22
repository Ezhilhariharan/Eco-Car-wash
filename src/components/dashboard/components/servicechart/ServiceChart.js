import React, { useEffect, useState } from "react";

import { Chart } from "primereact/chart";
import { getExteriorData } from "../../api/Api";
import { useTranslation } from 'react-i18next';
function ServiceChart(props) {
    const { t, i18n } = useTranslation();
    const [standarexterior, setStandarExteriorLable] = useState([]);
    const [standardexteriorcount, setStandardExteriorCount] = useState([]);
    useEffect(() => {
        getExteriorDataCounts(props);
    }, [props]);
    const getExteriorDataCounts = (data) => {
        getExteriorData(data)
            .then((res) => {
                // console.log(res.data.Data);
                setStandarExteriorLable(res.data.Data.labels);
                setStandardExteriorCount(res.data.Data.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    let basicData = {
        labels: [t(`${standarexterior[0]}`), t(`${standarexterior[1]}`)],
        datasets: [
            {
                backgroundColor: "#2B2E4A",
                data: standardexteriorcount,
            },
        ],
    };

    let horizontalOptions = {
        indexAxis: "y",
        maintainAspectRatio: false,
        aspectRatio: 0.8,
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
                    color: "#ebedef",
                },
            },
            y: {
                ticks: {
                    color: "#495057",
                },
                grid: {
                    color: "#ebedef",
                },
            },
        },
    };
    console.log("standarexterior", standarexterior);
    return (
        <div className="cards">
            <Chart
                type="bar"
                data={basicData}
                options={horizontalOptions}
                style={{
                    width: "100%",
                    height: "30vh",
                    marginTop: "30px",
                    padding: "10px",
                }}
            />
        </div>
    );
}

export default ServiceChart;
