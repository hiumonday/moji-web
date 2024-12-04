import React, { useState } from 'react';
import { format, addMonths, subMonths, startOfWeek, addDays, startOfMonth, endOfMonth, endOfWeek, isSameMonth, isSameDay, isBefore, isToday } from 'date-fns';
import Check from '../assets/check.svg';
const Calendar = ({ dates =[]}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const header = () => {
    const dateFormat = 'MMMM yyyy';

    return (
      <div className="flex items-center justify-between p-4 bg-transparent">
        <button
          onClick={() => setCurrentDate(subMonths(currentDate, 1))}
          className="focus:outline-none"
        >
          <span className="text-xl border px-2 py-0.5 rounded-lg text-gray-800">&lt;</span>
        </button>
        <span className="text-md font-medium">
          {format(currentDate, dateFormat)}
        </span>
        <button
          onClick={() => setCurrentDate(addMonths(currentDate, 1))}
          className="focus:outline-none"
        >
          <span className="text-xl border px-2 py-0.5 rounded-lg text-gray-800">&gt;</span>
        </button>
      </div>
    );
  };

  const daysOfWeek = () => {
    const dateFormat = 'EEEEE';
    const days = [];

    let startDate = startOfWeek(currentDate);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="flex-1 text-center p-2" key={i}>
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    return <div className="flex border-t text-gray-700">{days}</div>;
  };

  const onDateClick = (day) => {
    setSelectedDate(day);
  };

const cells = () => {
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const rows = [];

        let days = [];
        let day = startDate;
        let formattedDate = "";

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = format(day, 'd');
                const cloneDay = day;
                const isMatchedDate = dates.some(date => isSameDay(date, day));
                days.push(
                    <div
                        className={`relative flex items-center justify-center text-center cursor-pointer ${
                            i !== 6 ? 'border-r' : ''} border-b ${
                            i === 0 ? 'border-l' : ''} ${
                            !isSameMonth(day, monthStart)
                            ? 'text-gray-400'
                            : isMatchedDate ? 'bg-white' : (isSameDay(day, selectedDate) && !isMatchedDate) ? 'bg-indigo-500' : (!isMatchedDate && isBefore(day, new Date()) && !isSameDay(day, new Date())) ? 'bg-[#ff9292]' : ''}`}
                        style={{ width: '14.28%', height: '40px' }}
                        key={day}
                        onClick={() => onDateClick(cloneDay)}
                    >
                        {isMatchedDate && <div className="absolute inset-0 flex items-center justify-center">
                            {isMatchedDate && <div className="absolute inset-0 flex items-center justify-center">
                                <img src={Check} className="h-8 w-8" alt="Check icon" />
                            </div>}
                        </div>}
                        {!isMatchedDate && <div className={`absolute inset-0 flex items-center justify-center ${isToday(day) ? 'p-0.5' : ''}`}>
                            {isToday(day) && !isSameDay(day, selectedDate) && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-8 w-8 text-black">
                                <circle cx="12" cy="12" r="10" stroke-width="2"/>
                            </svg>}
                        </div>}
                        <span className={`z-10 ${isSameDay(day, selectedDate) && !isMatchedDate ? 'font-semibold text-white' : ''}`}>{formattedDate}</span>
                    </div>
                );
                day = addDays(day, 1);
            }
            rows.push(
                <div className={`flex ${rows.length === 0 ? 'border-t' : ''}`} key={day.toISOString()}>
                    {days}
                </div>
            );
            days = [];
        }
    while (rows.length < 6) {
        rows.push(
            <div className="flex" key={`empty-row-${rows.length}`}>
                {Array(7).fill(<div className="flex-1 text-center py-2 border-r h-full">&nbsp;</div>)}
            </div>
        );
    }

    return (
        <div className="flex-1 bg-white rounded-b-lg border-r border-l border-b">
            {rows}
        </div>
    );
};

  return (
    <div className="w-full h-full overflow-auto">
        {header()}
        {daysOfWeek()}
        {cells()}
    </div>
  );
};

export default Calendar;
