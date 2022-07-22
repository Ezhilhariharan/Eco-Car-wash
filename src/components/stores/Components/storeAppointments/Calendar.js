import React from "react";
import useCalendar from "./useCalendar";
import "./styles/Calendar.scss"

let date, changyear, reverseyear, monthanddate;
const Calendar = (props) => {
    const { calendarRows, selectedDate, todayFormatted, daysShort, monthNames, getNextMonth, getPrevMonth } = useCalendar();
    const { showcalender, selectdate } = props

    const dateClickHandler = data => {       
        let re = /-/g;
        let str = data;
        let result = re[Symbol.split](str);
        selectdate(result[2]+"-"+result[1]+"-"+result[0],result[0]+" "+monthNames[selectedDate.getMonth()]+" "+result[2])
    }
    console.log(monthNames[selectedDate.getMonth()]);
    console.log(showcalender);
    return (
        <div className={"Calendar d-flex h-100 mx-auto align-items-center justify-content-center" + (showcalender ? "" : "calender_opacity ")}>
            {/* <div className="d-flex flex-row w-100">
                <p className="my-auto ps-1 ps-sm-4" style={{color:"white"}}>Select Date</p>
                <div className="d-flex flex-row ms-auto my-auto me-1 me-sm-5"> <img
                    src="image/up.png"
                    alt=""
                    className="img-fluid rotate-left-calender"
                    onClick={getPrevMonth}
                />
                    <div className="monthandyear ms-2 me-2" style={{color:"white"}}>{`${monthNames[selectedDate.getMonth()]} - ${selectedDate.getFullYear()}`}</div>
                    <img
                        src="image/down.png"
                        alt=""
                        className="img-fluid rotate-right-calender"
                        onClick={getNextMonth}
                    /></div>
            </div> */}
            <div className="d-flex flex-row table-class">
                <table className="table my-auto">
                    <tbody className="w-100 justify-content-center align-items-center my-auto">
                    <tr>
                            <th>S</th>
                            <th>M</th>
                            <th>T</th>
                            <th>W</th>
                            <th>T</th>
                            <th>F</th>
                            <th>S</th>
                          </tr>
                        {
                            Object.values(calendarRows).map(cols => {
                                return <tr key={cols[0].date}>
                                    {cols.map(col => (
                                        col.date === todayFormatted
                                            ? <td key={col.date} className={`${col.classes} today`} style={{border:"none"}} onClick={() => dateClickHandler(col.date)}>
                                                {col.value}
                                            </td>
                                            : <td  key={col.date} className={col.classes} style={{border:"none"}} onClick={() => dateClickHandler(col.date)}>{col.value}</td>
                                    ))}
                                </tr>
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Calendar;

