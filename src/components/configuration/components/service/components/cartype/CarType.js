import React from "react";
import { useTranslation } from 'react-i18next';
import "./styles/CarType.scss";

export default function CarType({
    carList,
    carType,
    changeCarType,
    openCarModal,
}) {
    const { t, i18n } = useTranslation();
    return (
        <div className="car-type-selector mt-3">
            <div className="car-type-selector-header">{t('Car Type')}</div>
            <div className="car-type-selector-body">
                {carList.map((car) => {
                    return (
                        <button
                            className={`car-type-card ${carType === car.id ? "active" : null
                                }`}
                            onClick={() => changeCarType(car.id)}
                            key={car.id}
                        >
                            {car.name}
                        </button>
                    );
                })}
            </div>
            <div className="car-type-selector-footer ms-3">
                <button className="btn-white" onClick={() => openCarModal()}>
                    {t('Add')} +
                </button>
            </div>
        </div>
    );
}
