import React, { useEffect, useState } from "react";
import "./styles/ChartService.scss";
import { Chart } from "primereact/chart";
import { getExteriorData, getInteriorData } from "../../api/Api";
import ServiceChart from "../servicechart/ServiceChart";
import { useTranslation } from 'react-i18next';

function ChartService(props) {
    const { t, i18n } = useTranslation();
    const [index, setIndex] = useState(0);
    const [standardlabels, setStandardLabels] = useState([]);
    const [standarddata, setStandardData] = useState([]);

    useEffect(() => {
        getstandarModuleInteriorData(props);
    }, [props]);

    const getstandarModuleInteriorData = (data) => {
        // console.log("ChartService",data)
        getInteriorData(data)
            .then((res) => {
                console.log("chart service", res.data.Data.labels);
                setStandardLabels(res.data.Data.labels);
                setStandardData(res.data.Data.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    let basicData = {
        labels: [t(`${standardlabels[0]}`), t(`${standardlabels[1]}`)],
        datasets: [
            {
                backgroundColor: "#2B2E4A",
                data: standarddata,
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

    const getLightTheme = () => {
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
            rendererOptions: {
                barHeight: 26,
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

        return {
            horizontalOptions,
        };
    };
    console.log("standardlabels-iterior", standardlabels[0]);
    return (
        <div className="tab">
            <div className="tablist">
                <div
                    className={`tabHeader ${index === 0 ? "active" : null}`}
                    onClick={() => {
                        setIndex(0);
                    }}
                >
                    <span>
                        <i className="fas fa-circle circle_1"></i>
                    </span>
                    <span className="text-colors">{t('Interior')}</span>
                </div>
                <div
                    className={`tabHeader ${index === 1 ? "active" : null}`}
                    onClick={() => {
                        setIndex(1);
                    }}
                >
                    <span>
                        <i className="fas fa-circle circle_2"></i>
                    </span>
                    <span className="text-colors">{t('Exterior')}</span>
                </div>
            </div>
            <div className="tabcontent" hidden={index != 0}>
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
            </div>
            <div className="tabcontent" hidden={index != 1}>
                <ServiceChart type={props} />
            </div>
        </div>
    );
}

export default ChartService;
